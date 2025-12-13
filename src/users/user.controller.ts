import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user';
import { UpdatePasswordDto } from './dto/update-password';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  async getAll() {
    return await this.service.getAllUsers();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const user = await this.service.getUserById(id);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateUserDto) {
    if (
      !dto ||
      typeof dto.login !== 'string' ||
      typeof dto.password !== 'string'
    ) {
      throw new HttpException(
        'Missing or invalid fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    if (
      !dto ||
      typeof dto.oldPassword !== 'string' ||
      typeof dto.newPassword !== 'string'
    ) {
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);
    }

    const result = await this.service.update(id, dto);

    if (result === null) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const ok = await this.service.remove(id);
    if (!ok) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
