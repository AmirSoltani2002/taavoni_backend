import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthEmailDto, AuthNationalDto } from './dto/auth.dto';
import { Public } from './roles.decorator';
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  getTokenFromCookie,
} from './token-cookie';

@Public(true)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email')
  async signInWithEmail(
    @Body() signInDto: AuthEmailDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signInWithEmail(
      signInDto.email,
      signInDto.password,
    );
    response.cookie(AUTH_COOKIE_NAME, result.token, AUTH_COOKIE_OPTIONS);
    return { authenticated: true, user: result.user };
  }

  @Post('national')
  async signInWithNationalNumber(
    @Body() signInDto: AuthNationalDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signInWithNationalNumber(
      signInDto.nationalNumber,
      signInDto.password,
    );
    response.cookie(AUTH_COOKIE_NAME, result.token, AUTH_COOKIE_OPTIONS);
    return { authenticated: true, user: result.user };
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = getTokenFromCookie(request);
    if (token) {
      await this.authService.signOut(token);
    }
    response.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: AUTH_COOKIE_OPTIONS.secure,
      sameSite: AUTH_COOKIE_OPTIONS.sameSite,
      path: '/',
    });
    return { authenticated: false };
  }
}
