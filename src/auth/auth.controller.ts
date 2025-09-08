import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEmailDto, AuthNationalDto } from './dto/auth.dto';
import { Public } from './roles.decorator';

@Public(true)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email')
  signInWithEmail(@Body() signInDto: AuthEmailDto) {
    return this.authService.signInWithEmail(signInDto.email, signInDto.password)
  }

  @Post('national')
  signInWithNationalNumber(@Body() signInDto: AuthNationalDto) {
    return this.authService.signInWithNationalNumber(signInDto.nationalNumber, signInDto.password)
  }
}
