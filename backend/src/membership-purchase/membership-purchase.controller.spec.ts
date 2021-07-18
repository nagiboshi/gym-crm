import { Test, TestingModule } from '@nestjs/testing';
import { MembershipPurchaseController } from './membership-purchase.controller';

describe('MembershipPurchaseController', () => {
  let controller: MembershipPurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipPurchaseController],
    }).compile();

    controller = module.get<MembershipPurchaseController>(MembershipPurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
