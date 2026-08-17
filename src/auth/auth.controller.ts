import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthEmailDto, AuthNationalDto } from './dto/auth.dto';
import { Public } from './roles.decorator';
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
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
    response.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());
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
    response.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());
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
    const cookieOptions = getAuthCookieOptions();
    response.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });
    return { authenticated: false };
  }
}
