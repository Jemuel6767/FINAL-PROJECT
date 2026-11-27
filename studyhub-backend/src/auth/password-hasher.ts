import * as nodeCrypto from 'node:crypto';

type Argon2Parameters = {
  message: Buffer;
  nonce: Buffer;
  memory: number;
  passes: number;
  parallelism: number;
  tagLength: number;
};

type Argon2Module = typeof nodeCrypto & {
  argon2: (algorithm: 'argon2id', parameters: Argon2Parameters, callback: (error: Error | null, key: Buffer) => void) => void;
};

const cryptoWithArgon2 = nodeCrypto as Argon2Module;
const ARGON2_MEMORY_KIB = 65_536;
const ARGON2_PASSES = 3;
const ARGON2_PARALLELISM = 1;
const ARGON2_TAG_BYTES = 32;

function derive(message: Buffer, nonce: Buffer, memory: number, passes: number, parallelism: number, tagLength: number) {
  return new Promise<Buffer>((resolve, reject) => {
    cryptoWithArgon2.argon2('argon2id', { message, nonce, memory, passes, parallelism, tagLength }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = nodeCrypto.randomBytes(16);
  const digest = await derive(Buffer.from(password, 'utf8'), salt, ARGON2_MEMORY_KIB, ARGON2_PASSES, ARGON2_PARALLELISM, ARGON2_TAG_BYTES);
  return `$argon2id$v=19$m=${ARGON2_MEMORY_KIB},t=${ARGON2_PASSES},p=${ARGON2_PARALLELISM}$${salt.toString('base64')}$${digest.toString('base64')}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const match = /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$([^$]+)\$([^$]+)$/.exec(encoded);
  if (!match) return false;
  const [, memoryText, passesText, parallelismText, saltText, digestText] = match;
  const memory = Number(memoryText);
  const passes = Number(passesText);
  const parallelism = Number(parallelismText);
  const salt = Buffer.from(saltText, 'base64');
  const expected = Buffer.from(digestText, 'base64');
  if (memory < 8_192 || memory > 131_072 || passes < 1 || passes > 5 || parallelism < 1 || parallelism > 4 || salt.length < 16 || expected.length !== ARGON2_TAG_BYTES) return false;
  const actual = await derive(Buffer.from(password, 'utf8'), salt, memory, passes, parallelism, expected.length);
  return nodeCrypto.timingSafeEqual(actual, expected);
}
