import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVoucherCrudDialogComponent } from './purchase-voucher-crud-dialog.component';

describe('PurchaseVoucherCrudDialogComponent', () => {
  let component: PurchaseVoucherCrudDialogComponent;
  let fixture: ComponentFixture<PurchaseVoucherCrudDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseVoucherCrudDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseVoucherCrudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
