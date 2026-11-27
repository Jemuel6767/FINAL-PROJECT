import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { LearningMaterial } from '../materials/material.entity.js';

@Entity({ name: 'Category' })
export class Category {
  @PrimaryGeneratedColumn({ name: 'CategoryID', type: 'int' })
  categoryId!: number;

  @Column({ name: 'CategoryName', type: 'varchar', length: 50, unique: true })
  categoryName!: string;

  @OneToMany('LearningMaterial', 'category')
  materials!: LearningMaterial[];
}
