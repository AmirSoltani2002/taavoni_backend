import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { userinfo } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/auth/config';
import { UsersService } from 'src/users/users.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async signIn(user: userinfo | null, inputPassword: string) {
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    if (!(await PasswordService.compare(user.password, inputPassword))) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokenData = {
      id: user.id,
      type: user.type,
    };
    const token = await this.jwtService.signAsync(tokenData);
    await this.sessionService.create(token, tokenData);

    return {
      token,
      user: tokenData,
    };
  }

  async signInWithNationalNumber(nationalNumber: string, password: string) {
    const user =
      await this.userService.findOneByNationalNumber(nationalNumber);
    return this.signIn(user, password);
  }

  async signInWithEmail(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    return this.signIn(user, password);
  }

  async signOut(token: string) {
    await this.sessionService.revoke(token);
  }
}
