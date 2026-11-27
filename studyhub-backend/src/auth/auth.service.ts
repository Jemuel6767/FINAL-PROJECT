import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { verifyPassword } from './password-hasher.js';
import { TokenRevocationService } from './token-revocation.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtPayload } from './auth.types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly tokenRevocation: TokenRevocationService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.createStudent(dto);
    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPasswordHash(dto.email);
    if (!user || !(await verifyPassword(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.issueToken(user);
  }

  async logout(token: string) {
    const payload = this.jwtService.decode<JwtPayload>(token);
    if (payload?.jti && payload.exp) await this.tokenRevocation.revoke(payload.jti, payload.exp);
  }

  private async issueToken(user: { userId: number; email: string; role: import('../common/enums/user-role.enum.js').UserRole }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.userId,
      email: user.email,
      role: user.role,
      jti: randomUUID(),
    });
    return { access_token: accessToken, user: this.usersService.sanitize(user as never) };
  }
}
