import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseItemController } from './purchase-item.controller';

describe('PurchaseItemController', () => {
  let controller: PurchaseItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseItemController],
    }).compile();

    controller = module.get<PurchaseItemController>(PurchaseItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
