import { Test, TestingModule } from '@nestjs/testing';
import { SubProjectDocsService } from './sub-project-docs.service';

describe('SubProjectDocsService', () => {
  let service: SubProjectDocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubProjectDocsService],
    }).compile();

    service = module.get<SubProjectDocsService>(SubProjectDocsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
