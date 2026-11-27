import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { LoginRateLimitGuard } from './login-rate-limit.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly loginRateLimit: LoginRateLimitGuard) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginRateLimitGuard)
  async login(@Body() dto: LoginDto, @Req() request: Request) {
    const result = await this.authService.login(dto);
    this.loginRateLimit.reset(request.ip ?? 'unknown', dto.email);
    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: Request) {
    const authorization = request.headers.authorization ?? '';
    const token = authorization.replace(/^Bearer\s+/i, '');
    await this.authService.logout(token);
  }
}
