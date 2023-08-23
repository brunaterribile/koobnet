import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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
}
