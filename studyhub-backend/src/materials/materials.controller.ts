import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { User } from '../users/user.entity.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
import { UpdateMaterialDto } from './dto/update-material.dto.js';
import { MaterialsService } from './materials.service.js';

type AuthenticatedRequest = Request & { user: User };
const allowedExtensions = new Set(['.pdf', '.docx', '.pptx', '.txt']);
const allowedMimeTypes = new Set([
  'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'application/octet-stream',
]);

@Controller('materials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll(@Query('keyword') keyword?: string, @Query('subjectId') subjectId?: string, @Query('categoryId') categoryId?: string) {
    return this.materialsService.findAll(keyword, subjectId ? Number(subjectId) : undefined, categoryId ? Number(categoryId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.materialsService.findOne(id); }

  @Post()
  @Roles(UserRole.TEACHER)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (_req, _file, callback) => { const directory = join(process.cwd(), process.env.UPLOAD_DIR ?? 'uploads'); mkdirSync(directory, { recursive: true }); callback(null, directory); },
      filename: (_req, file, callback) => callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname).toLowerCase()}`),
    }),
    limits: { fileSize: Number(process.env.MAX_FILE_SIZE ?? 10485760) },
    fileFilter: (_req, file, callback) => { const extensionAllowed = allowedExtensions.has(extname(file.originalname).toLowerCase()); const mimeAllowed = allowedMimeTypes.has(file.mimetype); callback(extensionAllowed && mimeAllowed ? null : new BadRequestException('Only PDF, DOCX, PPTX, and TXT files are allowed'), extensionAllowed && mimeAllowed); },
  }))
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateMaterialDto, @UploadedFile() file: Express.Multer.File) { return this.materialsService.create(request.user.id, dto, file); }

  @Patch(':id')
  @Roles(UserRole.TEACHER)
  update(@Req() request: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMaterialDto) { return this.materialsService.update(request.user.id, id, dto); }

  @Delete(':id')
  @Roles(UserRole.TEACHER)
  async remove(@Req() request: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) { await this.materialsService.remove(request.user.id, id); }

  @Get(':id/download')
  async download(@Req() request: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number, @Res() response: Response) { const file = await this.materialsService.prepareDownload(request.user.id, id); return response.download(file.absolutePath, file.fileName); }
}
