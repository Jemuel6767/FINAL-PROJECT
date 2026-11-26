import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Download } from './download.entity.js';

@Injectable()
export class DownloadsService {
  constructor(@InjectRepository(Download) private readonly downloads: Repository<Download>) {}

  findMine(userId: number) {
    return this.downloads.find({ where: { userId }, relations: { material: true }, order: { downloadedAt: 'DESC' } });
  }
}
