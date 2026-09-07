import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { Roles } from '../src/auth/roles.decorator';
import { NegativeFloorsController } from '../src/negative-floors/negative-floors.controller';
import { NegativeFloorsService } from '../src/negative-floors/negative-floors.service';

describe('Negative floors API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  const negativeFloorsService = {
    createMany: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByBlock: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [NegativeFloorsController],
      providers: [
        { provide: NegativeFloorsService, useValue: negativeFloorsService },
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

  it('restricts negative-floor routes to admin and system roles', () => {
    expect(new Reflector().get(Roles, NegativeFloorsController)).toEqual([
      'admin',
      'system',
    ]);
  });

  it('POST /negative-floors creates a negative floor', async () => {
    const body = {
      floorNumber: 1,
      parkingCount: 0,
      storageCount: 2,
      description: 'زیرزمین نخست',
      blockId: 7,
    };
    const created = { id: 10, ...body };
    negativeFloorsService.create.mockResolvedValue(created);

    await request(httpServer)
      .post('/negative-floors')
      .send(body)
      .expect(201)
      .expect(created);

    expect(negativeFloorsService.create).toHaveBeenCalledWith(body);
  });

  it('POST /negative-floors rejects missing and invalid required counts', async () => {
    await request(httpServer)
      .post('/negative-floors')
      .send({ floorNumber: 1, storageCount: -1, blockId: 7 })
      .expect(400);

    expect(negativeFloorsService.create).not.toHaveBeenCalled();
  });

  it('POST /negative-floors rejects fractional counts', async () => {
    await request(httpServer)
      .post('/negative-floors')
      .send({
        floorNumber: 1,
        parkingCount: 1.5,
        storageCount: 0,
        blockId: 7,
      })
      .expect(400);

    expect(negativeFloorsService.create).not.toHaveBeenCalled();
  });

  it('POST /negative-floors/multiple creates multiple negative floors', async () => {
    const body = [
      { floorNumber: 1, parkingCount: 0, storageCount: 1, blockId: 7 },
      { floorNumber: 2, parkingCount: 3, storageCount: 0, blockId: 7 },
    ];
    negativeFloorsService.createMany.mockResolvedValue(body);

    await request(httpServer)
      .post('/negative-floors/multiple')
      .send(body)
      .expect(201)
      .expect(body);

    expect(negativeFloorsService.createMany).toHaveBeenCalledWith(body);
  });

  it('POST /negative-floors/multiple validates every floor', async () => {
    await request(httpServer)
      .post('/negative-floors/multiple')
      .send([
        { floorNumber: 1, parkingCount: 0, storageCount: 0, blockId: 7 },
        { floorNumber: 2, parkingCount: -1, storageCount: 0, blockId: 7 },
      ])
      .expect(400);

    expect(negativeFloorsService.createMany).not.toHaveBeenCalled();
  });

  it('GET /negative-floors returns every negative floor', async () => {
    const floors = [{ id: 1, floorNumber: 1, blockId: 7 }];
    negativeFloorsService.findAll.mockResolvedValue(floors);

    await request(httpServer)
      .get('/negative-floors')
      .expect(200)
      .expect(floors);
  });

  it('GET /negative-floors/block/:blockId converts the block ID', async () => {
    negativeFloorsService.findAllByBlock.mockResolvedValue([]);

    await request(httpServer).get('/negative-floors/block/7').expect(200);

    expect(negativeFloorsService.findAllByBlock).toHaveBeenCalledWith(7);
  });

  it('GET /negative-floors/:id converts the floor ID', async () => {
    negativeFloorsService.findOne.mockResolvedValue({ id: 10 });

    await request(httpServer).get('/negative-floors/10').expect(200);

    expect(negativeFloorsService.findOne).toHaveBeenCalledWith(10);
  });

  it('PATCH /negative-floors/:id updates the requested floor', async () => {
    const body = { parkingCount: 4 };
    negativeFloorsService.update.mockResolvedValue({ id: 10, ...body });

    await request(httpServer)
      .patch('/negative-floors/10')
      .send(body)
      .expect(200);

    expect(negativeFloorsService.update).toHaveBeenCalledWith(10, body);
  });

  it('DELETE /negative-floors/:id removes the requested floor', async () => {
    negativeFloorsService.remove.mockResolvedValue({ id: 10 });

    await request(httpServer).delete('/negative-floors/10').expect(200);

    expect(negativeFloorsService.remove).toHaveBeenCalledWith(10);
  });
});
