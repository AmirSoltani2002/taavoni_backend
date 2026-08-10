import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard, GlobalGuard, RolesGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    RolesGuard,
    AuthGuard,
    GlobalGuard,
  ],
  exports: [GlobalGuard, AuthGuard, RolesGuard, SessionService],
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '12h' },
      }),
    }),
  ],
})
export class AuthModule {}
