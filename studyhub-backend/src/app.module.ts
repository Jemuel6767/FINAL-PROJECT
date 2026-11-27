import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { MaterialsModule } from './materials/materials.module.js';
import { DownloadsModule } from './downloads/downloads.module.js';
import { User } from './users/user.entity.js';
import { Subject } from './subjects/subject.entity.js';
import { Category } from './categories/category.entity.js';
import { LearningMaterial } from './materials/material.entity.js';
import { Download } from './downloads/download.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME', 'studyhub_db'),
        entities: [User, Subject, Category, LearningMaterial, Download],
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    CategoriesModule,
    MaterialsModule,
    DownloadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
