import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { LearningMaterial } from '../materials/material.entity.js';

@Entity({ name: 'Subject' })
export class Subject {
  @PrimaryGeneratedColumn({ name: 'SubjectID', type: 'int' })
  subjectId!: number;

  @Column({ name: 'SubjectCode', type: 'varchar', length: 20, unique: true })
  subjectCode!: string;

  @Column({ name: 'SubjectName', type: 'varchar', length: 100 })
  subjectName!: string;

  @OneToMany('LearningMaterial', 'subject')
  materials!: LearningMaterial[];
}
