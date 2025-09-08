import { Test, TestingModule } from '@nestjs/testing';
import { SubprojectsController } from './subprojects.controller';
import { SubprojectsService } from './subprojects.service';

describe('SubprojectsController', () => {
  let controller: SubprojectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubprojectsController],
      providers: [SubprojectsService],
    }).compile();

    controller = module.get<SubprojectsController>(SubprojectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
