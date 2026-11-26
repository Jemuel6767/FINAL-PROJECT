import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import type { User } from '../users/user.entity.js';
import type { Material } from '../materials/material.entity.js';

@Entity('downloads')
export class Download {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'int', name: 'material_id' })
  materialId!: number;

  @CreateDateColumn({ name: 'downloaded_at' })
  downloadedAt!: Date;

  @ManyToOne('User', 'downloads', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne('Material', 'downloads', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'material_id' })
  material!: Material;
}
