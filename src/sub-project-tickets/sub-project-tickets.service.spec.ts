import { Test, TestingModule } from '@nestjs/testing';
import { SubProjectTicketsService } from './sub-project-tickets.service';

describe('SubProjectTicketsService', () => {
  let service: SubProjectTicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubProjectTicketsService],
    }).compile();

    service = module.get<SubProjectTicketsService>(SubProjectTicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
