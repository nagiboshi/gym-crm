import { Test, TestingModule } from '@nestjs/testing';
import { ClassCategoryController } from './class-category.controller';

describe('ClassCategoryController', () => {
  let controller: ClassCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassCategoryController],
    }).compile();

    controller = module.get<ClassCategoryController>(ClassCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
