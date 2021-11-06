import { ArticleEntity } from './article.entities';
import { classToPlain } from 'class-transformer';
import { User } from './../auth/user.decorator';
import { UserEntity } from './user.entities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entities';

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne((type) => UserEntity, (user) => user.comments, { eager: true })
  author: UserEntity;

  @ManyToOne((type) => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;
  toJSON() {
    return classToPlain(this);
  }
}
