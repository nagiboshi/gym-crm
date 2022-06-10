import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPurchaseDialogComponent } from './membership-purchase-dialog.component';

describe('MembershipPurchaseDialogComponent', () => {
  let component: MembershipPurchaseDialogComponent;
  let fixture: ComponentFixture<MembershipPurchaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipPurchaseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipPurchaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
