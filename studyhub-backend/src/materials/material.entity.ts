import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { User } from '../users/user.entity.js';
import type { Subject } from '../subjects/subject.entity.js';
import type { Category } from '../categories/category.entity.js';
import type { Download } from '../downloads/download.entity.js';

@Entity({ name: 'LearningMaterial' })
export class LearningMaterial {
  @PrimaryGeneratedColumn({ name: 'MaterialID', type: 'int' })
  materialId!: number;

  @Column({ name: 'Title', type: 'varchar', length: 150 })
  title!: string;

  @Column({ name: 'Description', type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'FilePath', type: 'varchar', length: 255 })
  filePath!: string;

  @CreateDateColumn({ name: 'UploadDate', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  uploadDate!: Date;

  @Column({ name: 'UserID', type: 'int' })
  userId!: number;

  @Column({ name: 'SubjectID', type: 'int' })
  subjectId!: number;

  @Column({ name: 'CategoryID', type: 'int' })
  categoryId!: number;

  @ManyToOne('User', 'materials', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'UserID', referencedColumnName: 'userId' })
  uploader!: User;

  @ManyToOne('Subject', 'materials', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'SubjectID', referencedColumnName: 'subjectId' })
  subject!: Subject;

  @ManyToOne('Category', 'materials', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'CategoryID', referencedColumnName: 'categoryId' })
  category!: Category;

  @OneToMany('Download', 'material')
  downloads!: Download[];
}
