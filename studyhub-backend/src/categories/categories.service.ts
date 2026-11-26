import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categories: Repository<Category>) {}
  findAll() { return this.categories.find({ order: { name: 'ASC' } }); }
  async findOne(id: number) { const item = await this.categories.findOne({ where: { id } }); if (!item) throw new NotFoundException('Category not found'); return item; }
  async create(dto: CreateCategoryDto) { try { return await this.categories.save(this.categories.create(dto)); } catch { throw new ConflictException('Category name already exists'); } }
  async update(id: number, dto: UpdateCategoryDto) { const item = await this.findOne(id); Object.assign(item, dto); try { return await this.categories.save(item); } catch { throw new ConflictException('Category name already exists'); } }
  async remove(id: number) { const item = await this.findOne(id); await this.categories.remove(item); }
}
