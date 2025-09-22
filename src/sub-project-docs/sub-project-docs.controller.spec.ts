import { Test, TestingModule } from '@nestjs/testing';
import { SubProjectDocsController } from './sub-project-docs.controller';
import { SubProjectDocsService } from './sub-project-docs.service';

describe('SubProjectDocsController', () => {
  let controller: SubProjectDocsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubProjectDocsController],
      providers: [SubProjectDocsService],
    }).compile();

    controller = module.get<SubProjectDocsController>(SubProjectDocsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
