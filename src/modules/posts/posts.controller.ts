import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.createPost(createPostDto, user);
  }

  @IsPublic()
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findPostById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: CreatePostDto,
    @CurrentUser() user: User,
  ) {
    return this.postsService.update(id, data, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.postsService.deletePost(id, user);
  }
}
