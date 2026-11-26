import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { User } from '../users/user.entity.js';
import type { Subject } from '../subjects/subject.entity.js';
import type { Category } from '../categories/category.entity.js';
import type { Download } from '../downloads/download.entity.js';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', name: 'file_name', length: 255 })
  fileName!: string;

  @Column({ type: 'varchar', name: 'file_path', length: 500 })
  filePath!: string;

  @Column({ type: 'varchar', name: 'file_type', length: 100 })
  fileType!: string;

  @Column({ name: 'file_size', type: 'int' })
  fileSize!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'int', name: 'subject_id' })
  subjectId!: number;

  @Column({ type: 'int', name: 'category_id' })
  categoryId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne('User', 'materials', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  owner!: User;

  @ManyToOne('Subject', 'materials', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;

  @ManyToOne('Category', 'materials', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @OneToMany('Download', 'material')
  downloads!: Download[];
}
