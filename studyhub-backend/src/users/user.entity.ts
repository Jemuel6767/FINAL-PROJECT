import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum.js';
import type { LearningMaterial } from '../materials/material.entity.js';
import type { Download } from '../downloads/download.entity.js';

@Entity({ name: 'User' })
@Check('chk_User_Role', "Role IN ('Teacher', 'Student')")
export class User {
  @PrimaryGeneratedColumn({ name: 'UserID', type: 'int' })
  userId!: number;

  @Column({ name: 'FullName', type: 'varchar', length: 100 })
  fullName!: string;

  @Column({ name: 'Email', type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ name: 'PasswordHash', type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({ name: 'Role', type: 'varchar', length: 10 })
  role!: UserRole;

  @OneToMany('LearningMaterial', 'uploader')
  materials!: LearningMaterial[];

  @OneToMany('Download', 'user')
  downloads!: Download[];
}
