import { Test, TestingModule } from '@nestjs/testing';
import { SubprojectChatsService } from './subproject-chats.service';

describe('SubprojectChatsService', () => {
  let service: SubprojectChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubprojectChatsService],
    }).compile();

    service = module.get<SubprojectChatsService>(SubprojectChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
