import { TagEntity } from './../entities/tag.entities';
import { OptionalAuthGuard } from './../auth/optional.authguard';
import { UpdateUserDTO } from 'src/models/users.model';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
  FindAllQuery,
  FindFeedQuery,
} from './../models/article.model';
import { UserEntity } from 'src/entities/user.entities';
import { ArticleEntity } from './../entities/article.entities';
import {
  Injectable,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
  ) {}

  private async upsertTag(tagList: string[]) {
    const foundTags = await this.tagRepo.find({
      where: tagList.map((tg) => ({ tag: tg })),
    });
    const newTags = tagList.filter(
      (t) => !foundTags.map((t) => t.tag).includes(t),
    );
    await Promise.all(
      this.tagRepo
        .create(newTags.map((t) => ({ tag: t })))
        .map((t) => t.save()),
    );
  }

  async findAll(user: UserEntity, query: FindAllQuery) {
    const findOptions: any = {};
    if (query.author) {
      findOptions.where['author.username'] = query.author;
    }
    if (query.favourited) {
      findOptions.where['favoriteOf.username'] = query.favourited;
    }
    if (query.tag) {
      findOptions.where.tagList = Like(`%${query.tag}%`);
    }
    if (query.offset) {
      findOptions.offset = query.offset;
    }
    if (query.limit) {
      findOptions.limit = query.limit;
    }
    return (await this.articleRepo.find(findOptions)).map((article) =>
      article.toArticle(user),
    );
  }

  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { following } = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['following'],
    });
    const findOptions = {
      ...query,
      where: following.map((follow) => ({ author: follow.id })),
    };
    return (await this.articleRepo.find(findOptions)).map((article) =>
      article.toArticle(user),
    );
  }

  findBySlug(slug: string) {
    return this.articleRepo.findOne({ where: { slug } });
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = this.articleRepo.create(data);
    article.author = user;
    await this.upsertTag(data.tagList);
    const { slug } = await article.save();
    return await (await this.articleRepo.findOne({ slug })).toArticle(user);
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepo.update({ slug }, data);
    return article.toArticle(user);
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    if (this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepo.remove(article);
  }

  async favoutitesArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favouriteOf.push(user);
    await article.save();
    return (await this.findBySlug(slug)).toArticle(user);
  }

  async unfavoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favouriteOf = article.favouriteOf.filter(
      (fav) => fav.id !== user.id,
    );
    await article.save();
    return (await this.findBySlug(slug)).toArticle(user);
  }
}
