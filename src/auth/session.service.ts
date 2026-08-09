import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import Redis from 'ioredis';

@Injectable()
export class SessionService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly ttlSeconds: number;

  constructor(config: ConfigService) {
    this.redis = new Redis(
      config.get<string>('REDIS_SESSION_URL') ??
        'redis://localhost:6379/1',
      {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
      },
    );
    this.ttlSeconds =
      config.get<number>('SESSION_TTL_SECONDS') ?? 12 * 60 * 60;
  }

  async create(
    token: string,
    payload: { id: number; type: string | null },
  ): Promise<void> {
    await this.redis.set(
      this.sessionKey(token),
      JSON.stringify(payload),
      'EX',
      this.ttlSeconds,
    );
  }

  async isActive(token: string): Promise<boolean> {
    return (await this.redis.exists(this.sessionKey(token))) === 1;
  }

  async revoke(token: string): Promise<void> {
    await this.redis.del(this.sessionKey(token));
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }

  private sessionKey(token: string): string {
    const digest = createHash('sha256').update(token).digest('hex');
    return `session:${digest}`;
  }
}
