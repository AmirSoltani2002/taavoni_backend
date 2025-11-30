import { Test, TestingModule } from '@nestjs/testing';
import { FinalTransactionService } from './final-transaction.service';

describe('FinalTransactionService', () => {
  let service: FinalTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinalTransactionService],
    }).compile();

    service = module.get<FinalTransactionService>(FinalTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
