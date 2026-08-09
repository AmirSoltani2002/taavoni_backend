import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable, tap } from 'rxjs';

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

    if (!mutationMethods.has(request.method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: () => {
          void this.cacheManager.clear();
        },
      }),
    );
  }
}
