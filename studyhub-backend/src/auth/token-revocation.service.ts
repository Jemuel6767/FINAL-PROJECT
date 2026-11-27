import { Injectable } from '@nestjs/common';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

@Injectable()
export class TokenRevocationService {
  private readonly revoked = new Map<string, number>();
  private readonly storagePath = resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'storage/private', 'revoked-tokens.json');
  private loaded?: Promise<void>;
  private pendingWrite = Promise.resolve();

  async revoke(tokenId: string, expiresAt: number) {
    await this.ensureLoaded();
    this.revoked.set(tokenId, expiresAt * 1000);
    this.removeExpired();
    this.pendingWrite = this.pendingWrite.then(() => this.persist());
    await this.pendingWrite;
  }

  async isRevoked(tokenId: string) {
    await this.ensureLoaded();
    const expiresAt = this.revoked.get(tokenId);
    if (expiresAt === undefined) return false;
    if (expiresAt <= Date.now()) {
      this.revoked.delete(tokenId);
      return false;
    }
    return true;
  }

  private ensureLoaded() {
    this.loaded ??= (async () => {
      try {
        const data = JSON.parse(await readFile(this.storagePath, 'utf8')) as Record<string, number>;
        for (const [tokenId, expiresAt] of Object.entries(data)) if (expiresAt > Date.now()) this.revoked.set(tokenId, expiresAt);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
    })();
    return this.loaded;
  }

  private async persist() {
    await mkdir(dirname(this.storagePath), { recursive: true });
    const temporaryPath = `${this.storagePath}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(Object.fromEntries(this.revoked)), { mode: 0o600 });
    await rename(temporaryPath, this.storagePath);
  }

  private removeExpired() {
    const now = Date.now();
    for (const [tokenId, expiresAt] of this.revoked) if (expiresAt <= now) this.revoked.delete(tokenId);
  }
}
