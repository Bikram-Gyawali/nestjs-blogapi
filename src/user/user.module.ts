import { AuthModule } from './../auth/auth.module';
import { UserEntity } from './../entities/user.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileController } from './profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  providers: [UserService],
  controllers: [UserController, ProfileController],
})
export class UserModule {}
