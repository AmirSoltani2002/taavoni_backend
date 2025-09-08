import { Test, TestingModule } from '@nestjs/testing';
import { SubprojectsService } from './subprojects.service';

describe('SubprojectsService', () => {
  let service: SubprojectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubprojectsService],
    }).compile();

    service = module.get<SubprojectsService>(SubprojectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
