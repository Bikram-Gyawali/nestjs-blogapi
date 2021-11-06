import { LoginDTO } from '../models/users.model';
import { AuthService } from './auth.service';
import { Body, Controller, Post, ValidationPipe, Res } from '@nestjs/common';
import { RegDTO } from 'src/models/users.model';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Res() res, @Body(ValidationPipe) cred: { user: RegDTO }) {
    // return await this.authService.register(cred);
    const response = await this.authService.register(cred.user);
    return { ...response };
    // return res.status(HttpStatus.OK).json({
    //   message: 'registered successfully',
    //   response: { ...response },
    // });
  }

  @Post('/login')
  async login(@Res() res, @Body(ValidationPipe) cred: { user: LoginDTO }) {
    // return await this.authService.login(cred);
    const response = await await this.authService.login(cred.user);
    return { ...response };

    // return res.status(HttpStatus.OK).json({
    //   message: 'logged in successfully',
    //   response: { ...response },
    // });
  }
}
