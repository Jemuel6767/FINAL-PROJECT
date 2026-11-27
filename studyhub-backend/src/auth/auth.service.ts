import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.createStudent(dto);
    return { message: 'Registration successful', ...(await this.issueToken(user)) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return { message: 'Login successful', ...(await this.issueToken(user)) };
  }

  private async issueToken(user: { id: number; email: string; role: import('../common/enums/user-role.enum.js').UserRole }) {
    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email, role: user.role });
    return { access_token: accessToken, user: this.usersService.sanitize(user as never) };
  }
}
