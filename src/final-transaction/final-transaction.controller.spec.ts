import { Test, TestingModule } from '@nestjs/testing';
import { FinalTransactionController } from './final-transaction.controller';
import { FinalTransactionService } from './final-transaction.service';

describe('FinalTransactionController', () => {
  let controller: FinalTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinalTransactionController],
      providers: [FinalTransactionService],
    }).compile();

    controller = module.get<FinalTransactionController>(FinalTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
