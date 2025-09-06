import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule,
            JwtModule.register({
              global: true,
              secret: jwtConstants.secret,
              signOptions: { expiresIn: '12h' },
            })
  ],
})
export class AuthModule {}
