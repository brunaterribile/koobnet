import { IsString } from 'class-validator';
import { Post } from '../entitites/post.entity';

export class CreatePostDto extends Post {
  @IsString()
  content: string;
}
