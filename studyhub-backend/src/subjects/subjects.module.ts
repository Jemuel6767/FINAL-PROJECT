import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity.js';
import { SubjectsController } from './subjects.controller.js';
import { SubjectsService } from './subjects.service.js';

@Module({ imports: [TypeOrmModule.forFeature([Subject])], controllers: [SubjectsController], providers: [SubjectsService], exports: [SubjectsService] })
export class SubjectsModule {}
