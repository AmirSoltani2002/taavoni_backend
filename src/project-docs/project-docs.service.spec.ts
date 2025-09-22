import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDocsService } from './project-docs.service';

describe('ProjectDocsService', () => {
  let service: ProjectDocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectDocsService],
    }).compile();

    service = module.get<ProjectDocsService>(ProjectDocsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
