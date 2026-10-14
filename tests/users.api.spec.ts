import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { OtherChatsService } from '../src/other-chats/other-chats.service';
import { OtherTicketsService } from '../src/other-tickets/other-tickets.service';
import { PasswordService } from '../src/auth/config';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

describe('Users API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  const usersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: OtherTicketsService, useValue: {} },
        { provide: OtherChatsService, useValue: {} },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use((req: Request, _res: Response, next: NextFunction) => {
      req['user'] = { id: 1, type: 'free' };
      next();
    });
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /users/:id accepts valid isargary information', async () => {
    const body = {
      isargaryType: 'janbaz',
      isargarRelation: 'self',
      janbaziPercent: 25,
    };
    usersService.update.mockResolvedValue({ id: 7, ...body });

    await request(httpServer)
      .patch('/users/7')
      .send(body)
      .expect(200)
      .expect({ id: 7, ...body });

    expect(usersService.update).toHaveBeenCalledWith(7, body);
  });

  it.each([
    { path: '/users/profile', userId: 1 },
    { path: '/users/7', userId: 7 },
  ])(
    'PATCH $path accepts blank optional phones and a work address',
    async ({ path, userId }) => {
      const body = {
        homePhone: '',
        workPhone: '   ',
        workAddress: 'تهران، خیابان کار',
      };
      usersService.update.mockResolvedValue({
        id: userId,
        homePhone: null,
        workPhone: null,
        workAddress: body.workAddress,
      });

      await request(httpServer).patch(path).send(body).expect(200);

      expect(usersService.update).toHaveBeenCalledWith(userId, {
        homePhone: null,
        workPhone: null,
        workAddress: body.workAddress,
      });
    },
  );

  it.each(['/users/profile', '/users/7'])(
    'PATCH %s rejects an invalid non-empty phone number',
    async (path) => {
      await request(httpServer)
        .patch(path)
        .send({ homePhone: 'not-a-phone' })
        .expect(400);

      expect(usersService.update).not.toHaveBeenCalled();
    },
  );

  it('POST /users allows signup without home and work phone numbers', async () => {
    jest
      .spyOn(PasswordService, 'hashPassword')
      .mockResolvedValue('hashed-password');
    usersService.create.mockResolvedValue({ id: 8 });

    await request(httpServer)
      .post('/users')
      .send({
        name: 'Test',
        lastName: 'User',
        sex: 'male',
        nationalNumber: '0012345678',
        password: 'safe-password',
        homePhone: '',
        workPhone: '',
      })
      .expect(201);

    expect(usersService.create).toHaveBeenCalledWith({
      name: 'Test',
      lastName: 'User',
      sex: 'male',
      nationalNumber: '0012345678',
      password: 'hashed-password',
      homePhone: null,
      workPhone: null,
    });
  });

  it.each([
    [{ isargaryType: 'unknown' }],
    [{ janbaziPercent: 12 }],
    [{ captivityMonths: 1.5 }],
    [{ frontPresenceMonths: 0 }],
  ])('PATCH /users/:id rejects invalid field values: %p', async (body) => {
    await request(httpServer).patch('/users/7').send(body).expect(400);

    expect(usersService.update).not.toHaveBeenCalled();
  });

  it('PATCH /users/:id accepts a password change for an investor target', async () => {
    const hashPassword = jest
      .spyOn(PasswordService, 'hashPassword')
      .mockResolvedValue('hashed-password');
    usersService.findOne.mockResolvedValue({ id: 7, type: 'free' });
    usersService.update.mockResolvedValue({
      id: 7,
      type: 'free',
      password: 'hashed-password',
    });

    await request(httpServer)
      .patch('/users/7')
      .send({ password: 'new-password' })
      .expect(200)
      .expect({ id: 7, type: 'free' });

    expect(hashPassword).toHaveBeenCalledWith('new-password');
    expect(usersService.update).toHaveBeenCalledWith(7, {
      password: 'hashed-password',
    });
  });

  it.each(['admin', 'system'])(
    'PATCH /users/:id rejects password changes for a %s target',
    async (targetType) => {
      const hashPassword = jest.spyOn(PasswordService, 'hashPassword');
      usersService.findOne.mockResolvedValue({ id: 7, type: targetType });

      await request(httpServer)
        .patch('/users/7')
        .send({ password: 'new-password' })
        .expect(403);

      expect(hashPassword).not.toHaveBeenCalled();
      expect(usersService.update).not.toHaveBeenCalled();
    },
  );
});
