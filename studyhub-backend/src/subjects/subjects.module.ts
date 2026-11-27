import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity.js';
import { SubjectsController } from './subjects.controller.js';
import { SubjectsService } from './subjects.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Module({ imports: [TypeOrmModule.forFeature([Subject])], controllers: [SubjectsController], providers: [SubjectsService, JwtAuthGuard, RolesGuard], exports: [SubjectsService] })
export class SubjectsModule {}
