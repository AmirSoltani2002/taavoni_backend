import { Test, TestingModule } from '@nestjs/testing';
import { OtherChatsController } from './other-chats.controller';
import { OtherChatsService } from './other-chats.service';

describe('OtherChatsController', () => {
  let controller: OtherChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtherChatsController],
      providers: [OtherChatsService],
    }).compile();

    controller = module.get<OtherChatsController>(OtherChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
