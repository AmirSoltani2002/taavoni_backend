import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';
import { lastValueFrom, of } from 'rxjs';
import { CacheInvalidationInterceptor } from '../src/cache/cache-invalidation.interceptor';
import { UserAwareCacheInterceptor } from '../src/cache/user-aware-cache.interceptor';

function contextFor(request: object): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

class TestableUserAwareCacheInterceptor extends UserAwareCacheInterceptor {
  public keyFor(context: ExecutionContext): string | undefined {
    return this.trackBy(context);
  }
}

describe('Redis-backed cache behavior', () => {
  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
    'clears cached responses after a successful %s',
    async (method) => {
      const cache = { clear: jest.fn().mockResolvedValue(undefined) };
      const interceptor = new CacheInvalidationInterceptor(
        cache as unknown as Cache,
      );
      const next: CallHandler = { handle: jest.fn(() => of({ ok: true })) };

      await expect(
        lastValueFrom(interceptor.intercept(contextFor({ method }), next)),
      ).resolves.toEqual({ ok: true });
      expect(cache.clear).toHaveBeenCalledTimes(1);
    },
  );

  it('does not clear cached responses for GET requests', async () => {
    const cache = { clear: jest.fn() };
    const interceptor = new CacheInvalidationInterceptor(
      cache as unknown as Cache,
    );
    const next: CallHandler = { handle: jest.fn(() => of({ ok: true })) };

    await lastValueFrom(
      interceptor.intercept(contextFor({ method: 'GET' }), next),
    );

    expect(cache.clear).not.toHaveBeenCalled();
  });

  it('propagates a cache-clear failure from a successful mutation', async () => {
    const cache = {
      clear: jest.fn().mockRejectedValue(new Error('Redis unavailable')),
    };
    const interceptor = new CacheInvalidationInterceptor(
      cache as unknown as Cache,
    );
    const next: CallHandler = { handle: jest.fn(() => of({ ok: true })) };

    await expect(
      lastValueFrom(
        interceptor.intercept(contextFor({ method: 'POST' }), next),
      ),
    ).rejects.toThrow('Redis unavailable');
  });

  it('separates GET cache entries by authenticated user', () => {
    const interceptor = new TestableUserAwareCacheInterceptor(
      {} as Cache,
      new Reflector(),
    );

    expect(
      interceptor.keyFor(
        contextFor({
          method: 'GET',
          originalUrl: '/api/projects/all',
          user: { id: 42 },
        }),
      ),
    ).toBe('http-cache:user:42:/api/projects/all');
  });

  it('uses a public cache key for an unauthenticated GET', () => {
    const interceptor = new TestableUserAwareCacheInterceptor(
      {} as Cache,
      new Reflector(),
    );

    expect(
      interceptor.keyFor(
        contextFor({ method: 'GET', originalUrl: '/api/projects/all' }),
      ),
    ).toBe('http-cache:user:public:/api/projects/all');
  });

  it('does not cache mutation requests', () => {
    const interceptor = new TestableUserAwareCacheInterceptor(
      {} as Cache,
      new Reflector(),
    );

    expect(
      interceptor.keyFor(
        contextFor({ method: 'PATCH', originalUrl: '/api/projects/1' }),
      ),
    ).toBeUndefined();
  });
});
