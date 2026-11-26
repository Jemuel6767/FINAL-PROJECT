import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/category.entity.js';
import { Download } from '../downloads/download.entity.js';
import { Subject } from '../subjects/subject.entity.js';
import { Material } from './material.entity.js';
import { MaterialsController } from './materials.controller.js';
import { MaterialsService } from './materials.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Material, Subject, Category, Download])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}
