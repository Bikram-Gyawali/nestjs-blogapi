import { CreateCommentDTO } from './../models/comment.model';
import { UserEntity } from 'src/entities/user.entities';
import { CommentEntity } from './../entities/comment.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  findByArticleSlug(slug: string) {
    return this.commentRepo.find({
      where: { 'article.slug': slug, relations: ['article'] },
    });
  }

  async findById(id: number) {
    return this.commentRepo.findOne({ where: { id } });
  }

  async createComment(user: UserEntity, data: CreateCommentDTO) {
    const comment = this.commentRepo.create(data);
    comment.author = user;
    await comment.save();

    return this.commentRepo.findOne({ where: { body: data.body } });
  }

  async deleteComment(user: UserEntity, id: number) {
    const comment = this.commentRepo.findOne({
      where: { id, 'author.id': user.id },
    });
    await comment.remove();
    return comment;
  }
}
