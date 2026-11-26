import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Download } from './download.entity.js';
import { DownloadsController } from './downloads.controller.js';
import { DownloadsService } from './downloads.service.js';

@Module({ imports: [TypeOrmModule.forFeature([Download])], controllers: [DownloadsController], providers: [DownloadsService], exports: [DownloadsService] })
export class DownloadsModule {}
