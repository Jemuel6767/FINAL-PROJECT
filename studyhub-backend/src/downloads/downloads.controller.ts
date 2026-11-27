import { Controller, ForbiddenException, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { User } from '../users/user.entity.js';
import { DownloadsService } from './downloads.service.js';

type AuthenticatedRequest = Request & { user: User };

@Controller('users/:userId/downloads')
@UseGuards(JwtAuthGuard)
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Get()
  findMine(@Param('userId', ParseIntPipe) userId: number, @Req() request: AuthenticatedRequest) {
    if (request.user.userId !== userId) throw new ForbiddenException('You can only view your own download history');
    return this.downloadsService.findMine(userId);
  }
}
