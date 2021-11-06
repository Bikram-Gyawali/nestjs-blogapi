import { OptionalAuthGuard } from './../auth/optional.authguard';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entities';
import { UserService } from './user.service';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/auth/user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get('/username')
  @UseGuards(new OptionalAuthGuard())
  async findProfile(
    @Param('username') username: string,
    @User() user: UserEntity,
  ) {
    const profile = await this.userService.findByUserName(username, user);
    if (!user) {
      throw new NotFoundException();
    }
    return { profile };
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async followUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ) {
    const follow = await this.userService.followUser(user, username);
    return { follow };
  }

  @Delete('/:username/unfollow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ) {
    const unfollow = await this.userService.unfollowUser(user, username);
    return { unfollow };
  }
}
