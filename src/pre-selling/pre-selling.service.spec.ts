import { Test, TestingModule } from '@nestjs/testing';
import { PreSellingService } from './pre-selling.service';

describe('PreSellingService', () => {
  let service: PreSellingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreSellingService],
    }).compile();

    service = module.get<PreSellingService>(PreSellingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
