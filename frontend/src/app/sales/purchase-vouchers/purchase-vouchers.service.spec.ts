import { TestBed } from '@angular/core/testing';

import { PurchaseVouchersService } from './purchase-vouchers.service';

describe('PurchaseVouchersService', () => {
  let service: PurchaseVouchersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseVouchersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
