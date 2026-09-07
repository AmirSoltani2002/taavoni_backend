import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import { NegativeFloorsService } from '../src/negative-floors/negative-floors.service';

describe('NegativeFloorsService', () => {
  const db = {
    block: { findUnique: jest.fn() },
    negativeFloor: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const service = new NegativeFloorsService(db as unknown as DatabaseService);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('creates a floor within the block configured range', async () => {
    const dto = {
      floorNumber: 2,
      parkingCount: 0,
      storageCount: 1,
      blockId: 7,
    };
    db.block.findUnique.mockResolvedValue({ negativeFloorCount: 2 });
    db.negativeFloor.create.mockResolvedValue({ id: 20, ...dto });

    await expect(service.create(dto)).resolves.toEqual({ id: 20, ...dto });
    expect(db.negativeFloor.create).toHaveBeenCalledWith({
      data: {
        floorNumber: 2,
        parkingCount: 0,
        storageCount: 1,
        block: { connect: { id: 7 } },
      },
    });
  });

  it('rejects a floor number above the block configured count', async () => {
    db.block.findUnique.mockResolvedValue({ negativeFloorCount: 1 });

    await expect(
      service.create({
        floorNumber: 2,
        parkingCount: 0,
        storageCount: 0,
        blockId: 7,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(db.negativeFloor.create).not.toHaveBeenCalled();
  });

  it('rejects a floor for a missing block', async () => {
    db.block.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        floorNumber: 1,
        parkingCount: 0,
        storageCount: 0,
        blockId: 404,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
