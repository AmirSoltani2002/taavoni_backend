import type { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { Reflector } from '@nestjs/core';
import { AuthGuard, RolesGuard } from '../src/auth/auth.guard';
import type { SessionService } from '../src/auth/session.service';

function contextFor(request: object): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => function handler() {},
    getClass: () => class TestController {},
  } as unknown as ExecutionContext;
}

describe('Authentication and authorization guards', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  };
  const jwt = {
    verifyAsync: jest.fn(),
  };
  const sessions = {
    isActive: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function authGuard(): AuthGuard {
    return new AuthGuard(
      jwt as unknown as JwtService,
      reflector as unknown as Reflector,
      sessions as unknown as SessionService,
    );
  }

  it('allows an explicitly public endpoint without a session', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    await expect(
      authGuard().canActivate(contextFor({ headers: {} })),
    ).resolves.toBe(true);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
    expect(sessions.isActive).not.toHaveBeenCalled();
  });

  it('rejects a protected endpoint without an authentication cookie', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    await expect(
      authGuard().canActivate(contextFor({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('attaches a verified user when the Redis session is active', async () => {
    const request: { headers: { cookie: string }; user?: object } = {
      headers: { cookie: 'tokenut=signed-token' },
    };
    const payload = { id: 5, type: 'admin' };
    reflector.getAllAndOverride.mockReturnValue(false);
    jwt.verifyAsync.mockResolvedValue(payload);
    sessions.isActive.mockResolvedValue(true);

    await expect(authGuard().canActivate(contextFor(request))).resolves.toBe(
      true,
    );
    expect(jwt.verifyAsync).toHaveBeenCalledWith('signed-token');
    expect(sessions.isActive).toHaveBeenCalledWith('signed-token');
    expect(request.user).toEqual(payload);
  });

  it('rejects a valid JWT when Redis reports an inactive session', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwt.verifyAsync.mockResolvedValue({ id: 5, type: 'admin' });
    sessions.isActive.mockResolvedValue(false);

    await expect(
      authGuard().canActivate(
        contextFor({ headers: { cookie: 'tokenut=signed-token' } }),
      ),
    ).rejects.toThrow('Invalid or expired session');
  });

  it.each([
    ['admin', true],
    ['system', true],
    ['free', false],
    [undefined, false],
  ])('applies endpoint roles to user type %s', (type, expected) => {
    reflector.getAllAndOverride.mockReturnValue(['admin', 'system']);
    const guard = new RolesGuard(reflector as unknown as Reflector);

    expect(guard.canActivate(contextFor({ user: { type } }))).toBe(expected);
  });
});
