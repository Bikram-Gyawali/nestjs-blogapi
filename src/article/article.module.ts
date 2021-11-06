import { TagEntity } from 'src/entities/tag.entities';
import { ArticleEntity } from 'src/entities/article.entities';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/entities/user.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(UserEntity, ArticleEntity, TagEntity),
    AuthModule,
  ],
  providers: [ArticleService, CommentsService],
  controllers: [ArticleController],
})
export class ArticleModule {}
