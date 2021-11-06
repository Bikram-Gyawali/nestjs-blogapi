import { CommentEntity } from './comment.entities';
import { classToPlain } from 'class-transformer';
import { UserEntity } from 'src/entities/user.entities';
import * as slug from 'slug';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  RelationCount,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from './abstract.entities';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  desc: string;

  @Column()
  body: string;

  @ManyToMany((type) => UserEntity, (user) => user.favourites, { eager: true })
  @JoinTable()
  favouriteOf: UserEntity[];

  @RelationCount((article: ArticleEntity) => article.favouriteOf)
  favouriteCount: number;

  @OneToMany((type) => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];

  @ManyToOne((type) => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;

  @Column('simple-array')
  tagList: string[];

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slug(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(34, 7)) | 0).toString(14);
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticle(user: UserEntity) {
    let favourated = null;
    if (user) {
      favourated = this.favouriteOf.map((user) => user.id).includes(user.id);
    }
    const article: any = this.toJSON();
    delete article.favouriteOf;
    return { ...article, favourated };
  }
}
