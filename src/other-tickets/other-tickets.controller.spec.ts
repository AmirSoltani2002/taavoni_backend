import { Test, TestingModule } from '@nestjs/testing';
import { OtherTicketsController } from './other-tickets.controller';
import { OtherTicketsService } from './other-tickets.service';

describe('OtherTicketsController', () => {
  let controller: OtherTicketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtherTicketsController],
      providers: [OtherTicketsService],
    }).compile();

    controller = module.get<OtherTicketsController>(OtherTicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
