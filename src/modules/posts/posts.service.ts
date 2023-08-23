import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
    const data = {
      ...createPostDto,
      userId: user.id,
    };

    return this.prisma.post.create({ data });
  }

  async findAll() {
    return this.prisma.post.findMany();
  }

  async findPostById(id: number) {
    const post = await this.prisma.post.findFirst({ where: { id } });
    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    return post;
  }
}
