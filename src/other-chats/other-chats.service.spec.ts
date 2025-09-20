import { Test, TestingModule } from '@nestjs/testing';
import { OtherChatsService } from './other-chats.service';

describe('OtherChatsService', () => {
  let service: OtherChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtherChatsService],
    }).compile();

    service = module.get<OtherChatsService>(OtherChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
