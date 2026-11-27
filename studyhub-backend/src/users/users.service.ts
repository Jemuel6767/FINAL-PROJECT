import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum.js';
import { hashPassword } from '../auth/password-hasher.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async createStudent(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.users.findOne({ where: { email } })) throw new ConflictException('Email is already registered');
    const user = this.users.create({
      fullName: dto.fullName.trim(),
      email,
      passwordHash: await hashPassword(dto.password),
      role: UserRole.STUDENT,
    });
    return this.sanitize(await this.users.save(user));
  }

  findByEmailWithPasswordHash(email: string) {
    return this.users.createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }

  async findById(userId: number) {
    const user = await this.users.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  sanitize(user: User) {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
