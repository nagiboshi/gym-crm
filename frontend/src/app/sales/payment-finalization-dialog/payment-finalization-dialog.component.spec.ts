import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFinalizationDialogComponent } from './payment-finalization-dialog.component';

describe('PaymentFinalizationDialogComponent', () => {
  let component: PaymentFinalizationDialogComponent;
  let fixture: ComponentFixture<PaymentFinalizationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentFinalizationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFinalizationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
