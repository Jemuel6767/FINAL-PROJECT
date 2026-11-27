import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/category.entity.js';
import { Download } from '../downloads/download.entity.js';
import { Subject } from '../subjects/subject.entity.js';
import { LearningMaterial } from './material.entity.js';
import { MaterialsController } from './materials.controller.js';
import { MaterialsService } from './materials.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([LearningMaterial, Subject, Category, Download])],
  controllers: [MaterialsController],
  providers: [MaterialsService, JwtAuthGuard, RolesGuard],
  exports: [MaterialsService],
})
export class MaterialsModule {}
