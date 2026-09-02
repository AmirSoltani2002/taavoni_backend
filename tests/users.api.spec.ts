import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OtherChatsService } from '../src/other-chats/other-chats.service';
import { OtherTicketsService } from '../src/other-tickets/other-tickets.service';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

describe('Users API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  const usersService = {
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
    [{ isargaryType: 'unknown' }],
    [{ janbaziPercent: 12 }],
    [{ captivityMonths: 1.5 }],
    [{ frontPresenceMonths: 0 }],
  ])('PATCH /users/:id rejects invalid field values: %p', async (body) => {
    await request(httpServer).patch('/users/7').send(body).expect(400);

    expect(usersService.update).not.toHaveBeenCalled();
  });
});
