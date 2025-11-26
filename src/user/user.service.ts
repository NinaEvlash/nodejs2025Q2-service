import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User, users } from './user.entity';
import { CreateUserDto } from './dto/create-user';
import { UpdatePasswordDto } from './dto/update-password';

@Injectable()
export class UserService {
  getAllUsers(): User[] {
    return users;
  }

  getUserById(id: string): User | undefined {
    const user = users.find((u) => u.id === id);
    return user;
  }

  create(dto: CreateUserDto): User {
    const dateNow = Date.now();
    const user: User = {
      id: uuid(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
    };
    users.push(user);
    return user;
  }

  update(id: string, dto: UpdatePasswordDto) {
    const user = this.getUserById(id);
    if (!user) return null;
    if (user.password !== dto.oldPassword) return 'Wrong password!';

    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  remove(id: string): boolean {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  }
}
