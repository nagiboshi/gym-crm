import { Test, TestingModule } from '@nestjs/testing';
import { ClassCategoryService } from './class-category.service';

describe('ClassCategoryService', () => {
  let service: ClassCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassCategoryService],
    }).compile();

    service = module.get<ClassCategoryService>(ClassCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
