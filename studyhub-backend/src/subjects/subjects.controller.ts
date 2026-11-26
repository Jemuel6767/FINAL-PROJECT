import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { SubjectsService } from './subjects.service.js';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}
  @Get() findAll() { return this.subjectsService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.subjectsService.findOne(id); }
  @Post() @Roles(UserRole.TEACHER) create(@Body() dto: CreateSubjectDto) { return this.subjectsService.create(dto); }
  @Patch(':id') @Roles(UserRole.TEACHER) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubjectDto) { return this.subjectsService.update(id, dto); }
  @Delete(':id') @Roles(UserRole.TEACHER) async remove(@Param('id', ParseIntPipe) id: number) { await this.subjectsService.remove(id); }
}
