import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { FinalTransactionController } from '../src/final-transaction/final-transaction.controller';
import { FinalTransactionService } from '../src/final-transaction/final-transaction.service';
import { TransactionController } from '../src/transaction/transaction.controller';
import { TransactionService } from '../src/transaction/transaction.service';

describe('Optional transaction payment details API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let currentUser = { id: 1, type: 'admin' };

  const transactionService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };
  const finalTransactionService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const endpoints = [
    {
      endpoint: '/transaction',
      relationField: 'presellingId',
      service: transactionService,
    },
    {
      endpoint: '/final-transaction',
      relationField: 'subProjectId',
      service: finalTransactionService,
    },
  ];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TransactionController, FinalTransactionController],
      providers: [
        { provide: TransactionService, useValue: transactionService },
        { provide: FinalTransactionService, useValue: finalTransactionService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use((req: Request, _res: Response, next: NextFunction) => {
      req['user'] = currentUser;
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
    currentUser = { id: 1, type: 'admin' };
  });

  afterAll(async () => {
    await app.close();
  });

  it.each(endpoints)(
    'allows admins to create $endpoint with only user, relation, and amount',
    async ({ endpoint, relationField, service }) => {
      service.create.mockResolvedValue({ id: 12 });

      await request(httpServer)
        .post(endpoint)
        .field('userId', '7')
        .field(relationField, '15')
        .field('amount', '2500000')
        .expect(201);

      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 7,
          [relationField]: 15,
          amount: 2500000,
        }),
      );
      const payload = service.create.mock.calls[0][0];
      expect(payload.bank).toBeUndefined();
      expect(payload.targetBank).toBeUndefined();
      expect(payload.number).toBeUndefined();
      expect(payload.date).toBeUndefined();
    },
  );

  it.each(endpoints)(
    'rejects ordinary-user creation without payment details for $endpoint',
    async ({ endpoint, relationField, service }) => {
      currentUser = { id: 7, type: 'free' };

      await request(httpServer)
        .post(endpoint)
        .field('userId', '7')
        .field(relationField, '15')
        .field('amount', '2500000')
        .expect(400);

      expect(service.create).not.toHaveBeenCalled();
    },
  );

  it.each(endpoints)(
    'keeps the relation required for admin creation at $endpoint',
    async ({ endpoint, service }) => {
      await request(httpServer)
        .post(endpoint)
        .field('userId', '7')
        .field('amount', '2500000')
        .expect(400);

      expect(service.create).not.toHaveBeenCalled();
    },
  );

  it.each(endpoints)(
    'allows admins to clear optional payment details when editing $endpoint',
    async ({ endpoint, service }) => {
      service.findOne.mockResolvedValue({ id: 12, userId: 7 });
      service.update.mockResolvedValue({ id: 12 });

      await request(httpServer)
        .patch(`${endpoint}/12`)
        .field('bank', '')
        .field('targetBank', '')
        .field('number', '')
        .field('date', '')
        .expect(200);

      expect(service.update).toHaveBeenCalledWith(
        12,
        expect.objectContaining({
          bank: null,
          targetBank: null,
          number: null,
          date: null,
        }),
      );
    },
  );

  it.each(endpoints)(
    'prevents ordinary users from clearing payment details when editing $endpoint',
    async ({ endpoint, service }) => {
      currentUser = { id: 7, type: 'free' };
      service.findOne.mockResolvedValue({ id: 12, userId: 7 });

      await request(httpServer)
        .patch(`${endpoint}/12`)
        .field('bank', '')
        .expect(400);

      expect(service.update).not.toHaveBeenCalled();
    },
  );
});
