import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CategoriesService } from './categories.service.js';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get() findAll() { return this.categoriesService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.categoriesService.findOne(id); }
  @Post() @Roles(UserRole.TEACHER) create(@Body() dto: CreateCategoryDto) { return this.categoriesService.create(dto); }
  @Patch(':id') @Roles(UserRole.TEACHER) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) { return this.categoriesService.update(id, dto); }
  @Delete(':id') @Roles(UserRole.TEACHER) async remove(@Param('id', ParseIntPipe) id: number) { await this.categoriesService.remove(id); }
}
