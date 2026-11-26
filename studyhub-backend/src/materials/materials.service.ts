import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'node:fs';
import { basename, isAbsolute, join, resolve } from 'node:path';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity.js';
import { Download } from '../downloads/download.entity.js';
import { Subject } from '../subjects/subject.entity.js';
import { Material } from './material.entity.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
import { UpdateMaterialDto } from './dto/update-material.dto.js';

@Injectable()
export class MaterialsService {
  private readonly uploadRoot = resolve(process.env.UPLOAD_DIR ?? 'uploads');

  constructor(
    @InjectRepository(Material) private readonly materials: Repository<Material>,
    @InjectRepository(Subject) private readonly subjects: Repository<Subject>,
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(Download) private readonly downloads: Repository<Download>,
  ) {}

  async findAll(keyword?: string, subjectId?: number, categoryId?: number) {
    const query = this.materials.createQueryBuilder('material')
      .leftJoinAndSelect('material.owner', 'owner')
      .leftJoinAndSelect('material.subject', 'subject')
      .leftJoinAndSelect('material.category', 'category')
      .orderBy('material.created_at', 'DESC');
    if (keyword) query.andWhere('(material.title LIKE :keyword OR material.description LIKE :keyword)', { keyword: `%${keyword}%` });
    if (subjectId) query.andWhere('material.subject_id = :subjectId', { subjectId });
    if (categoryId) query.andWhere('material.category_id = :categoryId', { categoryId });
    const materials = await query.getMany();
    return materials.map((material) => this.publicMaterial(material));
  }

  async findOne(id: number) {
    const material = await this.materials.findOne({ where: { id }, relations: { owner: true, subject: true, category: true } });
    if (!material) throw new NotFoundException('Material not found');
    return this.publicMaterial(material);
  }

  async create(ownerId: number, dto: CreateMaterialDto, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('A learning material file is required');
    await this.requireReferences(dto.subjectId, dto.categoryId);
    const material = this.materials.create({
      title: dto.title.trim(), description: dto.description?.trim() ?? null,
      fileName: file.originalname, filePath: file.path, fileType: file.mimetype,
      fileSize: file.size, userId: ownerId, subjectId: dto.subjectId, categoryId: dto.categoryId,
    });
    return this.publicMaterial(await this.materials.save(material));
  }

  async update(ownerId: number, id: number, dto: UpdateMaterialDto) {
    const material = await this.getOwnedMaterial(ownerId, id);
    if (dto.subjectId || dto.categoryId) await this.requireReferences(dto.subjectId ?? material.subjectId, dto.categoryId ?? material.categoryId);
    Object.assign(material, { ...dto, title: dto.title?.trim(), description: dto.description?.trim() });
    return this.publicMaterial(await this.materials.save(material));
  }

  async remove(ownerId: number, id: number) {
    const material = await this.getOwnedMaterial(ownerId, id);
    await this.materials.remove(material);
    if (material.filePath) await fs.unlink(material.filePath).catch(() => undefined);
  }

  async prepareDownload(userId: number, id: number) {
    const material = await this.materials.findOne({ where: { id } });
    if (!material) throw new NotFoundException('Material not found');
    const absolutePath = resolve(material.filePath);
    if (!absolutePath.startsWith(this.uploadRoot) || isAbsolute(material.filePath) && !absolutePath.startsWith(this.uploadRoot)) throw new ForbiddenException('Unsafe file path');
    await fs.access(absolutePath).catch(() => { throw new NotFoundException('Material file not found'); });
    await this.downloads.save(this.downloads.create({ userId, materialId: id }));
    return { absolutePath, fileName: basename(material.fileName) };
  }

  private async getOwnedMaterial(ownerId: number, id: number) {
    const material = await this.materials.findOne({ where: { id } });
    if (!material) throw new NotFoundException('Material not found');
    if (material.userId !== ownerId) throw new ForbiddenException('You can only modify your own materials');
    return material;
  }

  private async requireReferences(subjectId: number, categoryId: number) {
    const [subject, category] = await Promise.all([this.subjects.findOne({ where: { id: subjectId } }), this.categories.findOne({ where: { id: categoryId } })]);
    if (!subject) throw new NotFoundException('Subject not found');
    if (!category) throw new NotFoundException('Category not found');
  }

  private publicMaterial(material: Material) {
    return { ...material, owner: material.owner ? { id: material.owner.id, name: material.owner.name, email: material.owner.email, role: material.owner.role } : undefined };
  }
}
