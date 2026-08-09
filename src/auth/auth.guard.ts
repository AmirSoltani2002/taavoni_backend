import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Public, Roles } from 'src/auth/roles.decorator';
import { SessionService } from './session.service';
import { getTokenFromCookie } from './token-cookie';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const publicDec = this.reflector.getAllAndOverride(Public, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (publicDec) {
      return true;
    }

    const token = getTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Missing authentication cookie');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!(await this.sessionService.isActive(token))) {
        throw new UnauthorizedException('Session is no longer active');
      }
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.type);
  }
}

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly rolesGuard: RolesGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authResult = await this.authGuard.canActivate(context);
    if (!authResult) return false;
    return this.rolesGuard.canActivate(context);
  }
}
