import { Test, TestingModule } from '@nestjs/testing';
import {CategoryService} from './category.service';
import {Category} from './category';
import {Repository} from 'typeorm';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    const repo:Repository<Category> = service.repo;
    const categories = repo.find();
    console.log(categories);
  });
});
