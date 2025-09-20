import { Test, TestingModule } from '@nestjs/testing';
import { SubProjectTicketsController } from './sub-project-tickets.controller';
import { SubProjectTicketsService } from './sub-project-tickets.service';

describe('SubProjectTicketsController', () => {
  let controller: SubProjectTicketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubProjectTicketsController],
      providers: [SubProjectTicketsService],
    }).compile();

    controller = module.get<SubProjectTicketsController>(SubProjectTicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
