import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { BlocksController } from '../src/blocks/blocks.controller';
import { BlocksService } from '../src/blocks/blocks.service';

describe('Blocks API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  const blocksService = { create: jest.fn() };
  const validBlock = {
    name: 'بلوک الف',
    floorCount: 4,
    negativeFloorCount: 0,
    shareArea: 20,
    buildingArea: 300,
    projectId: 1,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BlocksController],
      providers: [{ provide: BlocksService, useValue: blocksService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('accepts zero negative floors when creating a block', async () => {
    blocksService.create.mockResolvedValue({ id: 7, ...validBlock });

    await request(httpServer).post('/blocks').send(validBlock).expect(201);

    expect(blocksService.create).toHaveBeenCalledWith(validBlock);
  });

  it.each([
    ['missing', undefined],
    ['negative', -1],
    ['fractional', 1.5],
  ])('rejects a %s negative-floor count', async (_case, value) => {
    const body = { ...validBlock, negativeFloorCount: value };
    if (value === undefined) {
      delete body.negativeFloorCount;
    }

    await request(httpServer).post('/blocks').send(body).expect(400);

    expect(blocksService.create).not.toHaveBeenCalled();
  });
});
