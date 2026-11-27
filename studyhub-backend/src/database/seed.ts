import 'dotenv/config';
import { DataSource } from 'typeorm';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { Category } from '../categories/category.entity.js';
import { Download } from '../downloads/download.entity.js';
import { LearningMaterial } from '../materials/material.entity.js';
import { Subject } from '../subjects/subject.entity.js';
import { User } from '../users/user.entity.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { hashPassword } from '../auth/password-hasher.js';

function makeSamplePdf() {
  const escapePdf = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const content = `BT /F1 20 Tf 72 720 Td (${escapePdf('StudyHub Learning Materials Guide')}) Tj 0 -32 Td /F1 12 Tf (${escapePdf('Sample PDF for the StudyHub development demo.')}) Tj ET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let index = 0; index < objects.length; index++) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, 'ascii');
}

const teacherEmail = (process.env.DEMO_TEACHER_EMAIL ?? 'teacher@example.com').trim().toLowerCase();
const studentEmail = (process.env.DEMO_STUDENT_EMAIL ?? 'student@example.com').trim().toLowerCase();
const teacherPassword = process.env.DEMO_TEACHER_PASSWORD;
const studentPassword = process.env.DEMO_STUDENT_PASSWORD;
if (!teacherPassword || !studentPassword) throw new Error('Set DEMO_TEACHER_PASSWORD and DEMO_STUDENT_PASSWORD in .env before running the demo seed.');

const privateRoot = resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'storage/private');
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'studyhub_v2',
  entities: [User, Subject, Category, LearningMaterial, Download],
  synchronize: false,
});

await dataSource.initialize();
try {
  const users = dataSource.getRepository(User);
  let teacher = await users.findOne({ where: { email: teacherEmail } });
  if (!teacher) {
    teacher = await users.save(users.create({ fullName: 'Demo Teacher', email: teacherEmail, passwordHash: await hashPassword(teacherPassword), role: UserRole.TEACHER }));
    console.log(`Demo teacher created: ${teacherEmail}`);
  }

  let student = await users.findOne({ where: { email: studentEmail } });
  if (!student) {
    student = await users.save(users.create({ fullName: 'Demo Student', email: studentEmail, passwordHash: await hashPassword(studentPassword), role: UserRole.STUDENT }));
    console.log(`Demo student created: ${studentEmail}`);
  }

  const subjects = dataSource.getRepository(Subject);
  let subject = await subjects.findOne({ where: { subjectCode: 'CS101' } });
  if (!subject) subject = await subjects.save(subjects.create({ subjectCode: 'CS101', subjectName: 'Computer Fundamentals' }));
  let englishSubject = await subjects.findOne({ where: { subjectCode: 'ENG101' } });
  if (!englishSubject) englishSubject = await subjects.save(subjects.create({ subjectCode: 'ENG101', subjectName: 'Communication Skills' }));

  const categories = dataSource.getRepository(Category);
  let handout = await categories.findOne({ where: { categoryName: 'Handout' } });
  if (!handout) handout = await categories.save(categories.create({ categoryName: 'Handout' }));
  for (const categoryName of ['Presentation', 'Worksheet']) {
    if (!(await categories.findOne({ where: { categoryName } }))) await categories.save(categories.create({ categoryName }));
  }

  const materials = dataSource.getRepository(LearningMaterial);
  const sampleTitle = 'StudyHub Learning Materials Guide';
  let sampleMaterial = await materials.findOne({ where: { title: sampleTitle } });
  if (!sampleMaterial) {
    await mkdir(privateRoot, { recursive: true });
    const storedPath = 'studyhub-sample-guide.pdf';
    await writeFile(join(privateRoot, storedPath), makeSamplePdf(), { mode: 0o600 });
    sampleMaterial = await materials.save(materials.create({
      title: sampleTitle,
      description: 'A sample PDF used to demonstrate secure browsing and downloads.',
      filePath: relative(process.cwd(), join(privateRoot, storedPath)).split(sep).join('/'),
      userId: teacher.userId,
      subjectId: subject.subjectId,
      categoryId: handout.categoryId,
    }));
  }

  if (student && !(await dataSource.getRepository(Download).findOne({ where: { userId: student.userId, materialId: sampleMaterial.materialId } }))) {
    await dataSource.getRepository(Download).save({ userId: student.userId, materialId: sampleMaterial.materialId });
  }
  console.log(`Sample subjects, categories, and material are ready. Added subject: ${englishSubject.subjectCode}.`);
} finally {
  await dataSource.destroy();
}
