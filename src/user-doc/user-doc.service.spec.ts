import { Test, TestingModule } from '@nestjs/testing';
import { UserDocService } from './user-doc.service';

describe('UserDocService', () => {
  let service: UserDocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDocService],
    }).compile();

    service = module.get<UserDocService>(UserDocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
