import { Test, TestingModule } from '@nestjs/testing';
import { OtherTicketsService } from './other-tickets.service';

describe('OtherTicketsService', () => {
  let service: OtherTicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtherTicketsService],
    }).compile();

    service = module.get<OtherTicketsService>(OtherTicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
