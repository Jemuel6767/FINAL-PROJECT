import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { User } from '../users/user.entity.js';
import { DownloadsService } from './downloads.service.js';

type AuthenticatedRequest = Request & { user: User };

@Controller('downloads')
@UseGuards(JwtAuthGuard)
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Get()
  findMine(@Req() request: AuthenticatedRequest) { return this.downloadsService.findMine(request.user.id); }
}
