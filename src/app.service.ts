import { TagEntity } from './entities/tag.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  findTags(){
    
  }
}
