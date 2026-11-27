import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Download } from './download.entity.js';

@Injectable()
export class DownloadsService {
  constructor(@InjectRepository(Download) private readonly downloads: Repository<Download>) {}

  async findMine(userId: number) {
    const records = await this.downloads.find({
      where: { userId },
      relations: { material: { subject: true, category: true } },
      order: { downloadDate: 'DESC' },
    });
    return records.map((record) => ({
      downloadId: record.downloadId,
      downloadDate: record.downloadDate,
      material: record.material ? {
        materialId: record.material.materialId,
        title: record.material.title,
        description: record.material.description,
        uploadDate: record.material.uploadDate,
        subject: record.material.subject ? { subjectId: record.material.subject.subjectId, subjectCode: record.material.subject.subjectCode, subjectName: record.material.subject.subjectName } : undefined,
        category: record.material.category ? { categoryId: record.material.category.categoryId, categoryName: record.material.category.categoryName } : undefined,
      } : null,
    }));
  }
}
