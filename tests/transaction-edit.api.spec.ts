import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import request from 'supertest';
import { FinalTransactionController } from '../src/final-transaction/final-transaction.controller';
import { FinalTransactionService } from '../src/final-transaction/final-transaction.service';
import { TransactionController } from '../src/transaction/transaction.controller';
import { TransactionService } from '../src/transaction/transaction.service';

const uploadTestSuffix = '-transaction-edit-test.txt';
const transactionUploadDirectory = path.join(
  process.cwd(),
  'uploads',
  'transaction',
);
const finalTransactionUploadDirectory = path.join(
  process.cwd(),
  'uploads',
  'final-transaction',
);

describe('Transaction edit API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

  const transactionService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };
  const finalTransactionService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

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
      req['user'] = { id: 1, type: 'admin' };
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
    for (const directory of [
      transactionUploadDirectory,
      finalTransactionUploadDirectory,
    ]) {
      if (!fs.existsSync(directory)) continue;
      for (const filename of fs.readdirSync(directory)) {
        if (filename.endsWith(uploadTestSuffix)) {
          fs.unlinkSync(path.join(directory, filename));
        }
      }
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    {
      endpoint: '/transaction/12',
      relationField: 'presellingId',
      service: transactionService,
    },
    {
      endpoint: '/final-transaction/12',
      relationField: 'subProjectId',
      service: finalTransactionService,
    },
  ])(
    'parses multipart fields when editing $endpoint',
    async ({ endpoint, relationField, service }) => {
      service.findOne.mockResolvedValue({
        id: 12,
        userId: 7,
        document: 'existing.pdf',
      });
      service.update.mockResolvedValue({ id: 12 });

      await request(httpServer)
        .patch(endpoint)
        .field('userId', '8')
        .field(relationField, '15')
        .field('amount', '2500000')
        .field('isConfirmed', 'false')
        .field('removeDocument', 'false')
        .expect(200);

      expect(service.update).toHaveBeenCalledWith(
        12,
        expect.objectContaining({
          userId: 8,
          [relationField]: 15,
          amount: 2500000,
          isConfirmed: false,
          removeDocument: false,
        }),
      );
    },
  );

  it('removes the current preselling transaction document', async () => {
    const filename = `existing${uploadTestSuffix}`;
    const filePath = path.join(transactionUploadDirectory, filename);
    fs.writeFileSync(filePath, 'existing document');
    transactionService.findOne.mockResolvedValue({
      id: 12,
      userId: 7,
      document: filename,
    });
    transactionService.update.mockResolvedValue({
      id: 12,
      document: null,
    });

    await request(httpServer)
      .patch('/transaction/12')
      .field('removeDocument', 'true')
      .expect(200);

    expect(transactionService.update).toHaveBeenCalledWith(
      12,
      expect.objectContaining({ removeDocument: true }),
    );
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('preserves the current document when no document change is requested', async () => {
    const filename = `preserved${uploadTestSuffix}`;
    const filePath = path.join(transactionUploadDirectory, filename);
    fs.writeFileSync(filePath, 'preserved document');
    transactionService.findOne.mockResolvedValue({
      id: 12,
      userId: 7,
      document: filename,
    });
    transactionService.update.mockResolvedValue({
      id: 12,
      document: filename,
    });

    await request(httpServer)
      .patch('/transaction/12')
      .field('bank', 'بانک جدید')
      .expect(200);

    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('adds a document to a transaction that has none', async () => {
    let updatePayload: { document?: string } = {};
    transactionService.findOne.mockResolvedValue({
      id: 12,
      userId: 7,
      document: null,
    });
    transactionService.update.mockImplementation(
      (_id: number, data: { document?: string }) => {
        updatePayload = data;
        return Promise.resolve({ id: 12, ...data });
      },
    );

    await request(httpServer)
      .patch('/transaction/12')
      .attach('file', Buffer.from('new document'), {
        filename: `added${uploadTestSuffix}`,
        contentType: 'text/plain',
      })
      .expect(200);

    expect(updatePayload.document).toBeDefined();
    expect(
      fs.existsSync(
        path.join(transactionUploadDirectory, updatePayload.document!),
      ),
    ).toBe(true);
  });

  it('replaces the current final transaction document', async () => {
    const oldFilename = `old${uploadTestSuffix}`;
    const oldFilePath = path.join(finalTransactionUploadDirectory, oldFilename);
    let updatePayload: { document?: string } = {};
    fs.writeFileSync(oldFilePath, 'old document');
    finalTransactionService.findOne.mockResolvedValue({
      id: 12,
      userId: 7,
      document: oldFilename,
    });
    finalTransactionService.update.mockImplementation(
      (_id: number, data: { document?: string }) => {
        updatePayload = data;
        return Promise.resolve({ id: 12, ...data });
      },
    );

    await request(httpServer)
      .patch('/final-transaction/12')
      .attach('file', Buffer.from('new document'), {
        filename: `new${uploadTestSuffix}`,
        contentType: 'text/plain',
      })
      .expect(200);

    expect(updatePayload.document).toBeDefined();
    expect(updatePayload.document).toMatch(
      new RegExp(`${uploadTestSuffix.replace('.', '\\.')}$`),
    );
    expect(fs.existsSync(oldFilePath)).toBe(false);
    expect(
      fs.existsSync(
        path.join(finalTransactionUploadDirectory, updatePayload.document!),
      ),
    ).toBe(true);
  });

  it('rejects replacing and removing a document in one request', async () => {
    await request(httpServer)
      .patch('/transaction/12')
      .field('removeDocument', 'true')
      .attach('file', Buffer.from('new document'), {
        filename: `conflict${uploadTestSuffix}`,
        contentType: 'text/plain',
      })
      .expect(400);

    expect(transactionService.update).not.toHaveBeenCalled();
  });
});
