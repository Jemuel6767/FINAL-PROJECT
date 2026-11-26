import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Category } from '../categories/category.entity.js';
import { Download } from '../downloads/download.entity.js';
import { Material } from '../materials/material.entity.js';
import { Subject } from '../subjects/subject.entity.js';
import { User } from '../users/user.entity.js';
import { UserRole } from '../common/enums/user-role.enum.js';

const password = process.env.DEMO_TEACHER_PASSWORD;
if (!password) throw new Error('Set DEMO_TEACHER_PASSWORD in .env before running the seed command.');

const dataSource = new DataSource({
  type: 'mysql', host: process.env.DB_HOST ?? 'localhost', port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_NAME ?? 'studyhub_db',
  entities: [User, Subject, Category, Material, Download], synchronize: false,
});

await dataSource.initialize();
const users = dataSource.getRepository(User);
const email = (process.env.DEMO_TEACHER_EMAIL ?? 'teacher@example.com').toLowerCase();
const existing = await users.findOne({ where: { email } });
if (existing) {
  console.log(`Demo teacher already exists: ${email}`);
} else {
  await users.save(users.create({ name: 'Demo Teacher', email, password: await bcrypt.hash(password, 12), role: UserRole.TEACHER }));
  console.log(`Demo teacher created: ${email}`);
}
await dataSource.destroy();
