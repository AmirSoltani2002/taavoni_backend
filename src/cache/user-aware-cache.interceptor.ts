import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';

@Injectable()
export class UserAwareCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'GET') {
      return undefined;
    }

    const userId = request.user?.id ?? 'public';
    return `http-cache:user:${userId}:${request.originalUrl}`;
  }
}
