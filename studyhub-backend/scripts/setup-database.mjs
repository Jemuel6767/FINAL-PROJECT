import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

try {
  const schema = await readFile(resolve(process.cwd(), 'database/studyhub-schema.sql'), 'utf8');
  await connection.query(schema);
  console.log('StudyHub schema is ready. Existing rows were not dropped.');
} finally {
  await connection.end();
}
