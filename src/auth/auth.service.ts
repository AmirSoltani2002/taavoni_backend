import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { userinfo } from '@prisma/client';
import { PasswordService } from 'src/auth/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService){}

    async signIn(user: userinfo | null, inputPassword: string) {
        if(!user)
            throw new NotFoundException('User is not found')
        if(!(await PasswordService.compare(user.password, inputPassword)))
            throw new UnauthorizedException('Incorrect password');
        const tokenData = {
            id: user.id,
            type: user.type,
        }
        return {token: await this.jwtService.signAsync(tokenData)}
    }

    async signInWithNationalNumber(nationalNumber: string, password: string) {
        const user = await this.userService.findOneByNationalNumber(nationalNumber);
        return this.signIn(user, password);
    }

    async signInWithEmail(email: string, password: string) {
        const user = await this.userService.findOneByEmail(email);
        return this.signIn(user, password);
    }
}
