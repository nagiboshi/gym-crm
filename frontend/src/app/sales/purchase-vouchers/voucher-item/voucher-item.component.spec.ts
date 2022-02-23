import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherItemComponent } from './voucher-item.component';

describe('VoucherItemComponent', () => {
  let component: VoucherItemComponent;
  let fixture: ComponentFixture<VoucherItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
