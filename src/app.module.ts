import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UsersModule, PostsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
