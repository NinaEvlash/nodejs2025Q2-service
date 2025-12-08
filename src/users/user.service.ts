import { Injectable } from '@nestjs/common';
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

  async getAllUsers() {
    const users = await this.repo.find();
    return users.map(({ password: password, ...rest }) => rest);
  }

  getUserById(id: string) {
    const user = this.repo.findOne({ where: { id } });
    return user;
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

    const { password, ...rest } = user;
    return rest;
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;
    if (user.password !== dto.oldPassword) return 'Wrong password!';

    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    await this.repo.save(user);

    const { password, ...rest } = user;
    return rest;
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    return result.affected > 0;
  }
}
