import { Controller, ForbiddenException, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';

type AuthenticatedRequest = Request & { user: User };

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  async getOwnProfile(@Param('userId', ParseIntPipe) userId: number, @Req() request: AuthenticatedRequest) {
    if (request.user.userId !== userId) throw new ForbiddenException('You can only view your own profile');
    return this.usersService.sanitize(await this.usersService.findById(userId));
  }
}
