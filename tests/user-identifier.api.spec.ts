import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Prisma, TYPE } from '@prisma/client';
import { PrismaExceptionFilter } from '../filters/prisma-exception.filter';
import request from 'supertest';
import { AuthGuard, GlobalGuard, RolesGuard } from '../src/auth/auth.guard';
import { PasswordService } from '../src/auth/config';
import { SessionService } from '../src/auth/session.service';
import { DatabaseService } from '../src/database/database.service';
import { OtherChatsService } from '../src/other-chats/other-chats.service';
import { OtherTicketsService } from '../src/other-tickets/other-tickets.service';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

const newUser = {
  name: 'Test',
  lastName: 'User',
  sex: 'male',
  nationalNumber: '0012345678',
  password: 'safe-password',
  type: 'free',
};
const storedUser = {
  id: 7,
  ...newUser,
  identifier: 15,
  isargaryType: 'none',
};

describe('User identifier API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  const db = {
    userinfo: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };
  const jwt = { verifyAsync: jest.fn() };
  const sessions = { isActive: jest.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthGuard,
        RolesGuard,
        { provide: APP_GUARD, useClass: GlobalGuard },
        { provide: DatabaseService, useValue: db },
        { provide: JwtService, useValue: jwt },
        { provide: SessionService, useValue: sessions },
        { provide: OtherTicketsService, useValue: {} },
        { provide: OtherChatsService, useValue: {} },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new PrismaExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jwt.verifyAsync.mockResolvedValue({ id: 7, type: 'admin' });
    sessions.isActive.mockResolvedValue(true);
    jest.spyOn(PasswordService, 'hashPassword').mockResolvedValue('hashed');
    db.userinfo.findUnique.mockResolvedValue(storedUser);
    db.userinfo.findMany.mockResolvedValue([storedUser]);
    db.userinfo.update.mockImplementation(({ data }: { data: object }) =>
      Promise.resolve({ ...storedUser, ...data }),
    );
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  afterAll(async () => {
    await app.close();
  });

  it.each(['admin', 'system'])(
    'POST /api/users/admin lets a %s create a user with identifier zero',
    async (type) => {
      jwt.verifyAsync.mockResolvedValue({ id: 1, type });
      db.userinfo.findUnique.mockResolvedValue(null);
      db.userinfo.create.mockImplementation(({ data }: { data: object }) =>
        Promise.resolve({ id: 8, ...data }),
      );
      const response = await request(httpServer)
        .post('/api/users/admin')
        .set('Cookie', 'tokenut=test-session')
        .send({ ...newUser, identifier: 0 })
        .expect(201);
      expect(response.body).toMatchObject({ id: 8, identifier: 0 });
      expect(response.body).not.toHaveProperty('password');
      expect(db.userinfo.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          identifier: 0,
          password: 'hashed',
        }) as unknown,
      });
    },
  );

  it.each(['admin', 'system'])(
    'PATCH /api/users/:id lets a %s set, change and clear an identifier',
    async (type) => {
      jwt.verifyAsync.mockResolvedValue({ id: 1, type });
      for (const identifier of [0, 42, 2147483647, null]) {
        await request(httpServer)
          .patch('/api/users/7')
          .set('Cookie', 'tokenut=test-session')
          .send({ identifier })
          .expect(200)
          .expect(({ body }: { body: Record<string, unknown> }) => {
            expect(body.identifier).toBe(identifier);
            expect(body).not.toHaveProperty('password');
          });
        expect(db.userinfo.update).toHaveBeenLastCalledWith({
          where: { id: 7 },
          data: expect.objectContaining({ identifier }) as unknown,
        });
      }
    },
  );

  it('PATCH /api/users/profile allows an admin to edit their own identifier', async () => {
    await request(httpServer)
      .patch('/api/users/profile')
      .set('Cookie', 'tokenut=test-session')
      .send({ identifier: 0 })
      .expect(200);
    expect(db.userinfo.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: expect.objectContaining({ identifier: 0 }) as unknown,
    });
  });

  it('preserves the identifier when updating unrelated fields', async () => {
    jwt.verifyAsync.mockResolvedValue({ id: 7, type: 'free' });
    await request(httpServer)
      .patch('/api/users/profile')
      .set('Cookie', 'tokenut=test-session')
      .send({ name: 'Updated' })
      .expect(200);
    const calls = db.userinfo.update.mock.calls as [
      { data: Record<string, unknown> },
    ][];
    expect(calls[0][0].data).not.toHaveProperty('identifier');
  });

  it.each([-1, 1.5, 'abc', '', ' ', false, true, [], {}, '12', 2147483648])(
    'rejects invalid identifier %p on creation and update',
    async (identifier) => {
      for (const path of ['/api/users/7', '/api/users/profile']) {
        await request(httpServer)
          .patch(path)
          .set('Cookie', 'tokenut=test-session')
          .send({ identifier })
          .expect(400);
      }
      await request(httpServer)
        .post('/api/users/admin')
        .set('Cookie', 'tokenut=test-session')
        .send({ ...newUser, identifier })
        .expect(400);
      expect(db.userinfo.update).not.toHaveBeenCalled();
      expect(db.userinfo.create).not.toHaveBeenCalled();
    },
  );

  it('returns a conflict when the database rejects a duplicate identifier', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const conflict = new Prisma.PrismaClientKnownRequestError(
      'Duplicate identifier',
      {
        code: 'P2002',
        clientVersion: '6.15.0',
        meta: { target: ['identifier'] },
      },
    );
    db.userinfo.update.mockRejectedValue(conflict);
    await request(httpServer)
      .patch('/api/users/7')
      .set('Cookie', 'tokenut=test-session')
      .send({ identifier: 15 })
      .expect(409);
    db.userinfo.findUnique.mockResolvedValue(null);
    db.userinfo.create.mockRejectedValue(conflict);
    await request(httpServer)
      .post('/api/users/admin')
      .set('Cookie', 'tokenut=test-session')
      .send({ ...newUser, identifier: 15 })
      .expect(409);
  });

  it.each([undefined, null])(
    'allows admin creation without an identifier (%p)',
    async (identifier) => {
      db.userinfo.findUnique.mockResolvedValue(null);
      db.userinfo.create.mockResolvedValue({ id: 8, identifier: null });
      await request(httpServer)
        .post('/api/users/admin')
        .set('Cookie', 'tokenut=test-session')
        .send({ ...newUser, identifier })
        .expect(201)
        .expect({ id: 8, identifier: null });
    },
  );

  it('requires authentication for admin creation', async () => {
    await request(httpServer)
      .post('/api/users/admin')
      .send({ ...newUser, identifier: 1 })
      .expect(401);
    expect(db.userinfo.create).not.toHaveBeenCalled();
  });

  it.each(
    Object.values(TYPE).filter((type) => !['admin', 'system'].includes(type)),
  )(
    'prevents a %s from setting, changing or clearing the identifier',
    async (type) => {
      jwt.verifyAsync.mockResolvedValue({ id: 7, type });
      for (const identifier of [0, 15, 42, null]) {
        await request(httpServer)
          .patch('/api/users/profile')
          .set('Cookie', 'tokenut=test-session')
          .send({ identifier })
          .expect(403);
        await request(httpServer)
          .patch('/api/users/7')
          .set('Cookie', 'tokenut=test-session')
          .send({ identifier })
          .expect(403);
      }
      await request(httpServer)
        .post('/api/users/admin')
        .set('Cookie', 'tokenut=test-session')
        .send({ ...newUser, identifier: 1 })
        .expect(403);
      expect(db.userinfo.update).not.toHaveBeenCalled();
      expect(db.userinfo.create).not.toHaveBeenCalled();
    },
  );

  it.each([0, null])(
    'POST /api/users rejects identifier %p in public signup',
    async (identifier) => {
      await request(httpServer)
        .post('/api/users')
        .send({ ...newUser, identifier })
        .expect(400);
      expect(db.userinfo.create).not.toHaveBeenCalled();
    },
  );

  it('preserves signup without an identifier', async () => {
    db.userinfo.findUnique.mockResolvedValue(null);
    db.userinfo.create.mockResolvedValue({ id: 8, identifier: null });
    await request(httpServer).post('/api/users').send(newUser).expect(201);
    const calls = db.userinfo.create.mock.calls as [
      { data: Record<string, unknown> },
    ][];
    expect(calls[0][0].data).not.toHaveProperty('identifier');
  });

  it('GET /api/users/profile shows a regular user their own identifier', async () => {
    jwt.verifyAsync.mockResolvedValue({ id: 7, type: 'free' });
    const response = await request(httpServer)
      .get('/api/users/profile')
      .set('Cookie', 'tokenut=test-session')
      .expect(200);
    expect(response.body).toMatchObject({ id: 7, identifier: 15 });
    expect(response.body).not.toHaveProperty('password');
    await request(httpServer)
      .get('/api/users/7')
      .set('Cookie', 'tokenut=test-session')
      .expect(403);
    await request(httpServer)
      .get('/api/users')
      .set('Cookie', 'tokenut=test-session')
      .expect(403);
  });

  it.each([
    '/api/users/national/0012345678',
    '/api/users/email/test@example.test',
  ])(
    'only reveals an identifier to its owner or an admin through %s',
    async (path) => {
      db.userinfo.findFirst.mockResolvedValue(storedUser);
      for (const actor of [
        { id: 7, type: 'free', visible: true },
        { id: 8, type: 'free', visible: false },
        { id: 8, type: 'admin', visible: true },
        { id: 8, type: 'system', visible: true },
      ]) {
        jwt.verifyAsync.mockResolvedValue(actor);
        const response = await request(httpServer)
          .get(path)
          .set('Cookie', 'tokenut=test-session')
          .expect(200);
        expect(response.body).not.toHaveProperty('password');
        if (actor.visible)
          expect(response.body).toHaveProperty('identifier', 15);
        else expect(response.body).not.toHaveProperty('identifier');
      }
    },
  );
});
