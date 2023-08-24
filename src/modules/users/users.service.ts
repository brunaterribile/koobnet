import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const userExist = await this.findByEmail(data.email);
    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const createdUser = this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: number, data: UpdateUserDto, user: User) {
    const userExist = await this.findUserById(id);

    if (userExist.id !== user.id)
      throw new HttpException(
        `You cannot change another user's data.`,
        HttpStatus.UNAUTHORIZED,
      );

    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async deleteUser(id: number, user: User) {
    const userExist = await this.findUserById(id);

    if (userExist.id !== user.id)
      throw new HttpException(
        `You cannot delete another user's account.`,
        HttpStatus.UNAUTHORIZED,
      );

    return await this.prisma.user.delete({ where: { id } });
  }
}
