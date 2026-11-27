import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { Request } from 'express';

type LoginRequest = Request & { body: { email?: string } };

@Injectable()
export class LoginRateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, { count: number; resetAt: number }>();
  private readonly limit = 5;
  private readonly windowMs = 15 * 60 * 1000;

  reset(ip: string, email: string) {
    this.attempts.delete(`${ip}:${email.trim().toLowerCase()}`);
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<LoginRequest>();
    const email = String(request.body?.email ?? '').trim().toLowerCase();
    const key = `${request.ip}:${email}`;
    const now = Date.now();
    const current = this.attempts.get(key);
    if (!current || current.resetAt <= now) {
      this.attempts.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (current.count >= this.limit) throw new HttpException('Too many login attempts. Try again in 15 minutes.', HttpStatus.TOO_MANY_REQUESTS);
    current.count++;
    if (this.attempts.size > 10_000) {
      for (const [attemptKey, value] of this.attempts) if (value.resetAt <= now) this.attempts.delete(attemptKey);
    }
    return true;
  }
}
