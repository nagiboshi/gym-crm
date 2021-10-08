import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVouchersListComponent } from './purchase-vouchers-list.component';

describe('PuchaseVouchersComponent', () => {
  let component: PurchaseVouchersListComponent;
  let fixture: ComponentFixture<PurchaseVouchersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseVouchersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseVouchersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
