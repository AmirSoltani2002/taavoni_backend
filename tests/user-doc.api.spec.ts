import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import request from 'supertest';
import { UserDocController } from '../src/user-doc/user-doc.controller';
import { UserDocService } from '../src/user-doc/user-doc.service';
import { UsersService } from '../src/users/users.service';

type Actor = {
  id: number;
  type: string | null;
};

const uploadDirectory = path.join(process.cwd(), 'uploads', 'userdocs');
const uploadTestSuffix = '-user-doc-access-test.txt';
const downloadTestFile = `user-doc-download-test-${process.pid}.txt`;

describe('User document API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let actor: Actor;

  const userDocService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const usersService = {
    findOne: jest.fn(),
  };

  const documentFor = (owner: Actor, detail = 'مدرک آزمایشی') => ({
    id: 12,
    userId: owner.id,
    document: downloadTestFile,
    detail,
    user: owner,
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserDocController],
      providers: [
        { provide: UserDocService, useValue: userDocService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use((req: Request, _res: Response, next: NextFunction) => {
      req['user'] = actor;
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
    actor = { id: 1, type: 'admin' };
  });

  afterEach(() => {
    if (!fs.existsSync(uploadDirectory)) return;
    for (const filename of fs.readdirSync(uploadDirectory)) {
      if (
        filename.endsWith(uploadTestSuffix) ||
        filename === downloadTestFile
      ) {
        fs.unlinkSync(path.join(uploadDirectory, filename));
      }
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it.each(['admin', 'system'])(
    'lets a %s upload a document for an investor',
    async (type) => {
      actor = { id: 1, type };
      usersService.findOne.mockResolvedValue({ id: 7, type: 'free' });
      userDocService.create.mockImplementation((data: object) =>
        Promise.resolve({ id: 12, ...data }),
      );

      await request(httpServer)
        .post('/user-doc')
        .field('userId', '7')
        .field('detail', 'کارت ملی')
        .attach('file', Buffer.from('test document'), {
          filename: `upload${uploadTestSuffix}`,
          contentType: 'text/plain',
        })
        .expect(201);

      expect(userDocService.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 7, detail: 'کارت ملی' }),
      );
    },
  );

  it('preserves owner document uploads', async () => {
    actor = { id: 7, type: 'free' };
    usersService.findOne.mockResolvedValue({ id: 7, type: 'free' });
    userDocService.create.mockImplementation((data: object) =>
      Promise.resolve({ id: 12, ...data }),
    );

    await request(httpServer)
      .post('/user-doc')
      .field('userId', '7')
      .attach('file', Buffer.from('test document'), {
        filename: `upload${uploadTestSuffix}`,
        contentType: 'text/plain',
      })
      .expect(201);

    expect(userDocService.create).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['admin', 'admin'],
    ['admin', 'system'],
    ['system', 'admin'],
    ['system', 'system'],
  ])(
    'prevents a %s from uploading a document for a %s',
    async (actorType, targetType) => {
      actor = { id: 1, type: actorType };
      usersService.findOne.mockResolvedValue({ id: 7, type: targetType });

      await request(httpServer)
        .post('/user-doc')
        .field('userId', '7')
        .attach('file', Buffer.from('test document'), {
          filename: `upload${uploadTestSuffix}`,
          contentType: 'text/plain',
        })
        .expect(403);

      expect(userDocService.create).not.toHaveBeenCalled();
    },
  );

  it('prevents an investor from uploading a document for another account', async () => {
    actor = { id: 4, type: 'free' };
    usersService.findOne.mockResolvedValue({ id: 7, type: 'tehranUni' });

    await request(httpServer)
      .post('/user-doc')
      .field('userId', '7')
      .attach('file', Buffer.from('test document'), {
        filename: `upload${uploadTestSuffix}`,
        contentType: 'text/plain',
      })
      .expect(403);

    expect(userDocService.create).not.toHaveBeenCalled();
  });

  it('leaves administrative profile-image uploads unchanged', async () => {
    actor = { id: 1, type: 'admin' };
    usersService.findOne.mockResolvedValue({ id: 7, type: 'admin' });
    userDocService.create.mockImplementation((data: object) =>
      Promise.resolve({ id: 12, ...data }),
    );

    await request(httpServer)
      .post('/user-doc')
      .field('userId', '7')
      .field('detail', 'profile-image')
      .attach('file', Buffer.from('profile image'), {
        filename: `upload${uploadTestSuffix}`,
        contentType: 'image/png',
      })
      .expect(201);

    expect(userDocService.create).toHaveBeenCalledTimes(1);
  });

  it.each([
    [{ id: 7, type: 'free' }, { id: 7, type: 'free' }, 200],
    [{ id: 1, type: 'admin' }, { id: 7, type: 'free' }, 200],
    [{ id: 1, type: 'system' }, { id: 7, type: null }, 200],
    [{ id: 1, type: 'admin' }, { id: 7, type: 'admin' }, 403],
    [{ id: 1, type: 'system' }, { id: 7, type: 'system' }, 403],
    [{ id: 4, type: 'free' }, { id: 7, type: 'free' }, 403],
    [{ id: 4, type: 'free' }, { id: 7, type: 'admin' }, 403],
  ] as const)(
    'applies document removal access for actor %p and owner %p',
    async (requestActor, owner, expectedStatus) => {
      actor = { ...requestActor };
      userDocService.findOne.mockResolvedValue(documentFor({ ...owner }));
      userDocService.remove.mockResolvedValue({ id: 12 });

      await request(httpServer).delete('/user-doc/12').expect(expectedStatus);

      if (expectedStatus === 200) {
        expect(userDocService.remove).toHaveBeenCalledWith(12);
      } else {
        expect(userDocService.remove).not.toHaveBeenCalled();
      }
    },
  );

  it('lets an owner update document metadata without changing ownership', async () => {
    actor = { id: 7, type: 'free' };
    userDocService.findOne.mockResolvedValue(
      documentFor({ id: 7, type: 'free' }),
    );
    userDocService.update.mockResolvedValue({ id: 12, detail: 'عنوان جدید' });

    await request(httpServer)
      .patch('/user-doc/12')
      .send({ detail: 'عنوان جدید' })
      .expect(200);

    expect(userDocService.update).toHaveBeenCalledWith(12, {
      detail: 'عنوان جدید',
    });
  });

  it('rejects document ownership changes', async () => {
    actor = { id: 1, type: 'admin' };
    userDocService.findOne.mockResolvedValue(
      documentFor({ id: 7, type: 'free' }),
    );

    await request(httpServer)
      .patch('/user-doc/12')
      .send({ userId: 8 })
      .expect(400);

    expect(userDocService.update).not.toHaveBeenCalled();
  });

  it('lets an administrator download an investor document', async () => {
    actor = { id: 1, type: 'admin' };
    fs.writeFileSync(path.join(uploadDirectory, downloadTestFile), 'download');
    userDocService.findOne.mockResolvedValue(
      documentFor({ id: 7, type: 'free' }),
    );

    const response = await request(httpServer)
      .get('/user-doc/download/12')
      .expect(200);

    expect(response.headers['content-disposition']).toContain(downloadTestFile);
  });

  it('leaves profile-image downloads unchanged', async () => {
    actor = { id: 4, type: 'free' };
    fs.writeFileSync(path.join(uploadDirectory, downloadTestFile), 'download');
    userDocService.findOne.mockResolvedValue(
      documentFor({ id: 7, type: 'admin' }, 'profile-image'),
    );

    await request(httpServer).get('/user-doc/download/12').expect(200);
  });

  it.each([
    [
      { id: 1, type: 'admin' },
      { id: 7, type: 'admin' },
    ],
    [
      { id: 4, type: 'free' },
      { id: 7, type: 'free' },
    ],
    [
      { id: 4, type: 'free' },
      { id: 7, type: 'admin' },
    ],
  ] as const)(
    'rejects document downloads for actor %p and owner %p',
    async (requestActor, owner) => {
      actor = { ...requestActor };
      userDocService.findOne.mockResolvedValue(documentFor({ ...owner }));

      await request(httpServer).get('/user-doc/download/12').expect(403);
    },
  );
});
