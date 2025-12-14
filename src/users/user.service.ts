import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user';
import { UpdatePasswordDto } from './dto/update-password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  private sanitize(user: User) {
    const { password, ...rest } = user;
    return {
      ...rest,
      version: Number(rest.version),
      createdAt: Number(rest.createdAt),
      updatedAt: Number(rest.updatedAt),
    };
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.repo.findOne({ where: { login } });
  }

  async getAllUsers() {
    const users = await this.repo.find();
    return users.map((u) => this.sanitize(u));
  }

  async getUserById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    return user ? this.sanitize(user) : null;
  }

  async create(dto: CreateUserDto) {
    if (!dto.login || !dto.password) {
      throw new HttpException('Invalid DTO', HttpStatus.BAD_REQUEST);
    }

    const existing = await this.findByLogin(dto.login);
    if (existing) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const dateNow = Date.now();

    const user = this.repo.create({
      login: dto.login,
      password: passwordHash,
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await this.repo.save(user);
    return this.sanitize(user);
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.version += 1;
    user.updatedAt = Date.now();

    await this.repo.save(user);
    return this.sanitize(user);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    return result.affected > 0;
  }
}
