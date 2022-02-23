import {Controller, Request, Get, Post, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import {AuthGuard} from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import {AuthService} from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Get()
  getHello(): string {
    return 'Server is up and running!';
  }
}
