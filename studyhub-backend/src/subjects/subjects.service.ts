import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

@Injectable()
export class SubjectsService {
  constructor(@InjectRepository(Subject) private readonly subjects: Repository<Subject>) {}

  findAll() {
    return this.subjects.find({ order: { subjectName: 'ASC' } });
  }

  async update(subjectId: number, dto: UpdateSubjectDto) {
    const subject = await this.subjects.findOne({ where: { subjectId } });
    if (!subject) throw new NotFoundException('Subject not found');
    if (dto.subjectCode !== undefined) subject.subjectCode = dto.subjectCode.trim();
    if (dto.subjectName !== undefined) subject.subjectName = dto.subjectName.trim();
    try {
      return await this.subjects.save(subject);
    } catch {
      throw new ConflictException('Subject code already exists');
    }
  }
}
