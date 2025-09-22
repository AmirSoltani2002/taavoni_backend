import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDocsController } from './project-docs.controller';
import { ProjectDocsService } from './project-docs.service';

describe('ProjectDocsController', () => {
  let controller: ProjectDocsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDocsController],
      providers: [ProjectDocsService],
    }).compile();

    controller = module.get<ProjectDocsController>(ProjectDocsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
