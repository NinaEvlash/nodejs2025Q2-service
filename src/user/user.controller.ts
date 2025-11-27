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
  getAll() {
    return this.service.getAllUsers();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const user = this.service.getUserById(id);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto) {
    if (!dto.login || !dto.password) {
      throw new HttpException('Missing fields', HttpStatus.BAD_REQUEST);
    }
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const result = this.service.update(id, dto);

    if (result === null) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    if (result === 'Wrong password!') {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const ok = this.service.remove(id);
    if (!ok) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
