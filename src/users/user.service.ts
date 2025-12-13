import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async getAllUsers() {
    const users = await this.repo.find();
    return users.map((u) => this.sanitize(u));
  }

  async getUserById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;
    return this.sanitize(user);
  }

  async create(dto: CreateUserDto) {
    const dateNow = Date.now();
    const user = this.repo.create({
      login: dto.login,
      password: dto.password,
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
    if (user.password !== dto.oldPassword) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }

    user.password = dto.newPassword;
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
