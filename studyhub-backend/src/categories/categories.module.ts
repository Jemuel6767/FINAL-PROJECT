import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity.js';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Module({ imports: [TypeOrmModule.forFeature([Category])], controllers: [CategoriesController], providers: [CategoriesService, JwtAuthGuard], exports: [CategoriesService] })
export class CategoriesModule {}
