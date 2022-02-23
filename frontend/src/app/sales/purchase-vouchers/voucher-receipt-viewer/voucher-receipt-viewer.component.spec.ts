import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherReceiptViewerComponent } from './voucher-receipt-viewer.component';

describe('VoucherReceiptViewerComponent', () => {
  let component: VoucherReceiptViewerComponent;
  let fixture: ComponentFixture<VoucherReceiptViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherReceiptViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherReceiptViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
