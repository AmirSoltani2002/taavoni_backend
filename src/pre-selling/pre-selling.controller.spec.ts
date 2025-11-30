import { Test, TestingModule } from '@nestjs/testing';
import { PreSellingController } from './pre-selling.controller';
import { PreSellingService } from './pre-selling.service';

describe('PreSellingController', () => {
  let controller: PreSellingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreSellingController],
      providers: [PreSellingService],
    }).compile();

    controller = module.get<PreSellingController>(PreSellingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
