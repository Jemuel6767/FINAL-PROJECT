import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async createStudent(dto: CreateUserDto): Promise<User> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.users.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email is already registered');
    const user = this.users.create({ name: dto.name.trim(), email, password: await bcrypt.hash(dto.password, 12), role: UserRole.STUDENT });
    return this.users.save(user);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.users.createQueryBuilder('user').addSelect('user.password').where('user.email = :email', { email: email.toLowerCase() }).getOne();
  }

  async findById(id: number): Promise<User> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  sanitize(user: User) {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
