import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'node:fs';
import { basename, extname, join, resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity.js';
import { Download } from '../downloads/download.entity.js';
import { Subject } from '../subjects/subject.entity.js';
import { User } from '../users/user.entity.js';
import { LearningMaterial } from './material.entity.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
import { UpdateMaterialDto } from './dto/update-material.dto.js';

const supportedExtensions = new Set(['.pdf', '.docx', '.pptx']);

function zipContains(buffer: Buffer, wanted: string) {
  let eocd = -1;
  const minEocd = Math.max(0, buffer.length - 65_557);
  for (let i = buffer.length - 22; i >= minEocd; i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) return false;
  const entries = buffer.readUInt16LE(eocd + 10);
  let cursor = buffer.readUInt32LE(eocd + 16);
  for (let i = 0; i < entries && cursor + 46 <= buffer.length; i++) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) return false;
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const name = buffer.subarray(cursor + 46, cursor + 46 + nameLength).toString('utf8');
    if (name === wanted) return true;
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return false;
}

function isValidDocument(file: Express.Multer.File) {
  const extension = extname(file.originalname).toLowerCase();
  if (!supportedExtensions.has(extension) || !file.buffer?.length) return false;
  if (extension === '.pdf') return file.buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  const contentTypes = zipContains(file.buffer, '[Content_Types].xml');
  if (!contentTypes) return false;
  if (extension === '.docx') return zipContains(file.buffer, 'word/document.xml');
  return zipContains(file.buffer, 'ppt/presentation.xml');
}

@Injectable()
export class MaterialsService {
  private readonly privateRoot = resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'storage/private');
  private readonly publicRoot = resolve(process.cwd(), 'public');

  constructor(
    @InjectRepository(LearningMaterial) private readonly materials: Repository<LearningMaterial>,
    @InjectRepository(Subject) private readonly subjects: Repository<Subject>,
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(Download) private readonly downloads: Repository<Download>,
  ) {}

  async findAll(search?: string, subjectId?: number, categoryId?: number) {
    const query = this.materials.createQueryBuilder('material')
      .leftJoinAndSelect('material.uploader', 'uploader')
      .leftJoinAndSelect('material.subject', 'subject')
      .leftJoinAndSelect('material.category', 'category')
      .orderBy('material.uploadDate', 'DESC');
    if (search?.trim()) query.andWhere('(material.title LIKE :search OR material.description LIKE :search)', { search: `%${search.trim()}%` });
    if (subjectId) query.andWhere('material.subjectId = :subjectId', { subjectId });
    if (categoryId) query.andWhere('material.categoryId = :categoryId', { categoryId });
    return (await query.getMany()).map((material) => this.toPublicMaterial(material));
  }

  async findOne(materialId: number) {
    const material = await this.materials.findOne({ where: { materialId }, relations: { uploader: true, subject: true, category: true } });
    if (!material) throw new NotFoundException('Learning material not found');
    return this.toPublicMaterial(material);
  }

  async create(userId: number, dto: CreateMaterialDto, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Choose a PDF, DOCX, or PPTX file');
    if (!isValidDocument(file)) throw new BadRequestException('The uploaded file content does not match a supported PDF, DOCX, or PPTX document');
    await this.requireReferences(dto.subjectId, dto.categoryId);
    await fs.mkdir(this.privateRoot, { recursive: true });
    if (this.privateRoot === this.publicRoot || this.privateRoot.startsWith(`${this.publicRoot}${sep}`)) {
      throw new BadRequestException('Private upload storage must be outside the public web directory');
    }
    const extension = extname(file.originalname).toLowerCase();
    const absolutePath = join(this.privateRoot, `${randomUUID()}${extension}`);
    const storedPath = relativePathFromWorkingDirectory(absolutePath);
    if (storedPath.length > 255) throw new BadRequestException('Configured upload path exceeds the database FilePath limit');
    await fs.writeFile(absolutePath, file.buffer, { flag: 'wx', mode: 0o600 });
    try {
      const material = await this.materials.save(this.materials.create({
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        filePath: storedPath,
        userId,
        subjectId: dto.subjectId,
        categoryId: dto.categoryId,
      }));
      return await this.findOne(material.materialId);
    } catch (error) {
      await fs.unlink(absolutePath).catch(() => undefined);
      throw error;
    }
  }

  async update(userId: number, materialId: number, dto: UpdateMaterialDto) {
    const material = await this.getOwnedMaterial(userId, materialId);
    if (dto.subjectId !== undefined || dto.categoryId !== undefined) {
      await this.requireReferences(dto.subjectId ?? material.subjectId, dto.categoryId ?? material.categoryId);
    }
    if (dto.title !== undefined) material.title = dto.title.trim();
    if (dto.description !== undefined) material.description = dto.description?.trim() || null;
    if (dto.subjectId !== undefined) material.subjectId = dto.subjectId;
    if (dto.categoryId !== undefined) material.categoryId = dto.categoryId;
    await this.materials.save(material);
    return this.findOne(materialId);
  }

  async remove(userId: number, materialId: number) {
    const material = await this.getOwnedMaterial(userId, materialId);
    if (await this.downloads.count({ where: { materialId } })) {
      throw new ConflictException('This material has download records and cannot be deleted');
    }
    try {
      await this.materials.remove(material);
    } catch {
      throw new ConflictException('This material cannot be deleted while records reference it');
    }
    const absolutePath = this.resolvePrivatePath(material.filePath);
    await fs.unlink(absolutePath).catch(() => undefined);
  }

  async getDownloadFile(materialId: number) {
    const material = await this.materials.findOne({ where: { materialId } });
    if (!material) throw new NotFoundException('Learning material not found');
    const absolutePath = this.resolvePrivatePath(material.filePath);
    await fs.access(absolutePath).catch(() => { throw new NotFoundException('Material file not found'); });
    const extension = extname(absolutePath).toLowerCase();
    const safeTitle = material.title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').slice(0, 120) || 'learning-material';
    return { absolutePath, downloadName: `${safeTitle}${extension}` };
  }

  async recordDownload(userId: number, materialId: number) {
    await this.downloads.save(this.downloads.create({ userId, materialId }));
  }

  private async getOwnedMaterial(userId: number, materialId: number) {
    const material = await this.materials.findOne({ where: { materialId } });
    if (!material) throw new NotFoundException('Learning material not found');
    if (material.userId !== userId) throw new ForbiddenException('You can only modify materials you uploaded');
    return material;
  }

  private async requireReferences(subjectId: number, categoryId: number) {
    const [subject, category] = await Promise.all([
      this.subjects.findOne({ where: { subjectId } }),
      this.categories.findOne({ where: { categoryId } }),
    ]);
    if (!subject) throw new NotFoundException('Subject not found');
    if (!category) throw new NotFoundException('Category not found');
  }

  private resolvePrivatePath(storedPath: string) {
    const absolutePath = resolve(process.cwd(), storedPath);
    if (!absolutePath.startsWith(`${this.privateRoot}${sep}`)) throw new ForbiddenException('Unsafe private file path');
    return absolutePath;
  }

  private toPublicMaterial(material: LearningMaterial) {
    return {
      materialId: material.materialId,
      title: material.title,
      description: material.description,
      uploadDate: material.uploadDate,
      userId: material.userId,
      subjectId: material.subjectId,
      categoryId: material.categoryId,
      uploader: material.uploader ? { userId: material.uploader.userId, fullName: material.uploader.fullName } : undefined,
      subject: material.subject ? { subjectId: material.subject.subjectId, subjectCode: material.subject.subjectCode, subjectName: material.subject.subjectName } : undefined,
      category: material.category ? { categoryId: material.category.categoryId, categoryName: material.category.categoryName } : undefined,
      downloadUrl: `/api/v1/learning-materials/${material.materialId}/download`,
    };
  }
}

function relativePathFromWorkingDirectory(absolutePath: string) {
  return absolutePath.slice(resolve(process.cwd()).length + 1).split(sep).join('/');
}
