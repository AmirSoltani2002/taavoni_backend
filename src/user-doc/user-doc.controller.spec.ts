import { Test, TestingModule } from '@nestjs/testing';
import { UserDocController } from './user-doc.controller';
import { UserDocService } from './user-doc.service';

describe('UserDocController', () => {
  let controller: UserDocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDocController],
      providers: [UserDocService],
    }).compile();

    controller = module.get<UserDocController>(UserDocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
