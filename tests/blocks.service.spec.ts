import { DatabaseService } from '../src/database/database.service';
import { BlocksService } from '../src/blocks/blocks.service';

describe('BlocksService', () => {
  const transaction = {
    block: { update: jest.fn() },
    negativeFloor: { deleteMany: jest.fn() },
  };
  const db = {
    $transaction: jest.fn((callback: (client: typeof transaction) => unknown) =>
      callback(transaction),
    ),
  };
  const service = new BlocksService(db as unknown as DatabaseService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes negative floors beyond a reduced block count', async () => {
    transaction.block.update.mockResolvedValue({
      id: 7,
      negativeFloorCount: 1,
    });
    transaction.negativeFloor.deleteMany.mockResolvedValue({ count: 2 });

    await service.update(7, { negativeFloorCount: 1 });

    expect(transaction.negativeFloor.deleteMany).toHaveBeenCalledWith({
      where: { blockId: 7, floorNumber: { gt: 1 } },
    });
  });

  it('does not delete negative floors for unrelated block updates', async () => {
    transaction.block.update.mockResolvedValue({ id: 7, name: 'بلوک جدید' });

    await service.update(7, { name: 'بلوک جدید' });

    expect(transaction.negativeFloor.deleteMany).not.toHaveBeenCalled();
  });
});
