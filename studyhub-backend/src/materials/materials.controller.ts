import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { User } from '../users/user.entity.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
import { UpdateMaterialDto } from './dto/update-material.dto.js';
import { MaterialsService } from './materials.service.js';
import { extname } from 'node:path';

type AuthenticatedRequest = Request & { user: User };
const allowedExtensions = new Set(['.pdf', '.docx', '.pptx']);
const allowedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/octet-stream',
]);

@Controller('learning-materials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('subjectId') subjectId?: string, @Query('categoryId') categoryId?: string) {
    return this.materialsService.findAll(search, subjectId ? Number(subjectId) : undefined, categoryId ? Number(categoryId) : undefined);
  }

  @Get('deletable')
  @Roles(UserRole.TEACHER)
  findDeletable(@Req() request: AuthenticatedRequest) {
    return this.materialsService.findDeletable(request.user.userId);
  }

  @Post()
  @Roles(UserRole.TEACHER)
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: Number(process.env.MAX_FILE_SIZE ?? 10 * 1024 * 1024), files: 1 },
    fileFilter: (_request, file, callback) => {
      const extensionAllowed = allowedExtensions.has(extname(file.originalname).toLowerCase());
      const mimeAllowed = allowedMimeTypes.has(file.mimetype);
      callback(extensionAllowed && mimeAllowed ? null : new BadRequestException('Only PDF, DOCX, and PPTX files are allowed'), extensionAllowed && mimeAllowed);
    },
  }))
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateMaterialDto, @UploadedFile() file: Express.Multer.File) {
    return this.materialsService.create(request.user.userId, dto, file);
  }

  @Patch(':materialId')
  @Roles(UserRole.TEACHER)
  update(@Req() request: AuthenticatedRequest, @Param('materialId', ParseIntPipe) materialId: number, @Body() dto: UpdateMaterialDto) {
    return this.materialsService.update(request.user.userId, materialId, dto);
  }

  @Delete(':materialId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.TEACHER)
  remove(@Req() request: AuthenticatedRequest, @Param('materialId', ParseIntPipe) materialId: number) {
    return this.materialsService.remove(request.user.userId, materialId);
  }

  @Get(':materialId/download')
  async download(@Req() request: AuthenticatedRequest, @Param('materialId', ParseIntPipe) materialId: number, @Res() response: Response) {
    const file = await this.materialsService.getDownloadFile(materialId);
    return response.download(file.absolutePath, file.downloadName, async (error) => {
      if (error) {
        if (!response.headersSent) response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: 500, message: 'Unable to download this material' });
        return;
      }
      await this.materialsService.recordDownload(request.user.userId, materialId);
    });
  }
}
