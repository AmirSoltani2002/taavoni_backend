import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import Redis from 'ioredis';
import { SessionService } from '../src/auth/session.service';

const mockRedis = {
  set: jest.fn(),
  exists: jest.fn(),
  del: jest.fn(),
  quit: jest.fn(),
};

jest.mock('ioredis', () => ({
  __esModule: true,
  default: jest.fn(() => mockRedis),
}));

describe('SessionService Redis sessions', () => {
  const config = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        REDIS_SESSION_URL: 'redis://test.invalid:6379/9',
        SESSION_TTL_SECONDS: '90',
      };
      return values[key];
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createService(): SessionService {
    return new SessionService(config as unknown as ConfigService);
  }

  it('creates an isolated Redis client from configuration', () => {
    createService();

    expect(Redis).toHaveBeenCalledWith('redis://test.invalid:6379/9', {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });
  });

  it('stores a hashed session key with JSON payload and expiry', async () => {
    const service = createService();
    const token = 'secret-token';
    const key = 'session:' + createHash('sha256').update(token).digest('hex');
    mockRedis.set.mockResolvedValue('OK');

    await service.create(token, { id: 4, type: 'admin' });

    expect(mockRedis.set).toHaveBeenCalledWith(
      key,
      JSON.stringify({ id: 4, type: 'admin' }),
      'EX',
      90,
    );
    expect(mockRedis.set).not.toHaveBeenCalledWith(
      expect.stringContaining(token),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });

  it.each([
    [1, true],
    [0, false],
  ])('maps Redis exists=%i to active=%s', async (exists, expected) => {
    const service = createService();
    mockRedis.exists.mockResolvedValue(exists);

    await expect(service.isActive('token')).resolves.toBe(expected);
  });

  it('revokes the hashed session key', async () => {
    const service = createService();
    const key = 'session:' + createHash('sha256').update('token').digest('hex');
    mockRedis.del.mockResolvedValue(1);

    await service.revoke('token');

    expect(mockRedis.del).toHaveBeenCalledWith(key);
  });

  it('propagates Redis failures to the caller', async () => {
    const service = createService();
    mockRedis.exists.mockRejectedValue(new Error('Redis unavailable'));

    await expect(service.isActive('token')).rejects.toThrow(
      'Redis unavailable',
    );
  });

  it('closes Redis during module shutdown', async () => {
    const service = createService();
    mockRedis.quit.mockResolvedValue('OK');

    await service.onModuleDestroy();

    expect(mockRedis.quit).toHaveBeenCalledTimes(1);
  });
});
