import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

@Injectable()
export class SubjectsService {
  constructor(@InjectRepository(Subject) private readonly subjects: Repository<Subject>) {}

  findAll() { return this.subjects.find({ order: { name: 'ASC' } }); }
  async findOne(id: number) { const item = await this.subjects.findOne({ where: { id } }); if (!item) throw new NotFoundException('Subject not found'); return item; }
  async create(dto: CreateSubjectDto) { try { return await this.subjects.save(this.subjects.create(dto)); } catch { throw new ConflictException('Subject name already exists'); } }
  async update(id: number, dto: UpdateSubjectDto) { const item = await this.findOne(id); Object.assign(item, dto); try { return await this.subjects.save(item); } catch { throw new ConflictException('Subject name already exists'); } }
  async remove(id: number) { const item = await this.findOne(id); await this.subjects.remove(item); }
}
