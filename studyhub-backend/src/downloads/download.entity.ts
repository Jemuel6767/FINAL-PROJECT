import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import type { User } from '../users/user.entity.js';
import type { LearningMaterial } from '../materials/material.entity.js';

@Entity({ name: 'Download' })
export class Download {
  @PrimaryGeneratedColumn({ name: 'DownloadID', type: 'int' })
  downloadId!: number;

  @Column({ name: 'UserID', type: 'int' })
  userId!: number;

  @Column({ name: 'MaterialID', type: 'int' })
  materialId!: number;

  @CreateDateColumn({ name: 'DownloadDate', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  downloadDate!: Date;

  @ManyToOne('User', 'downloads', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'UserID', referencedColumnName: 'userId' })
  user!: User;

  @ManyToOne('LearningMaterial', 'downloads', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'MaterialID', referencedColumnName: 'materialId' })
  material!: LearningMaterial;
}
