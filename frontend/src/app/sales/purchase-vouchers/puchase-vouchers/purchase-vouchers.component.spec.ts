import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVouchersComponent } from './purchase-vouchers.component';

describe('PuchaseVouchersComponent', () => {
  let component: PurchaseVouchersComponent;
  let fixture: ComponentFixture<PurchaseVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
