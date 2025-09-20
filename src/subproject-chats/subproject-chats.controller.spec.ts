import { Test, TestingModule } from '@nestjs/testing';
import { SubprojectChatsController } from './subproject-chats.controller';
import { SubprojectChatsService } from './subproject-chats.service';

describe('SubprojectChatsController', () => {
  let controller: SubprojectChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubprojectChatsController],
      providers: [SubprojectChatsService],
    }).compile();

    controller = module.get<SubprojectChatsController>(SubprojectChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
