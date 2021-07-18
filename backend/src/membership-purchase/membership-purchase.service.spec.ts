import { Test, TestingModule } from '@nestjs/testing';
import { MembershipPurchaseService } from './membership-purchase.service';

describe('MembershipPurchaseService', () => {
  let service: MembershipPurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipPurchaseService],
    }).compile();

    service = module.get<MembershipPurchaseService>(MembershipPurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
