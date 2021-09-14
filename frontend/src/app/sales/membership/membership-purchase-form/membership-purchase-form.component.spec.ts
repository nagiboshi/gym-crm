import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MembershipPurchaseFormComponent } from './membership-purchase-form.component';

describe('PurchaseFormComponent', () => {
  let component: MembershipPurchaseFormComponent;
  let fixture: ComponentFixture<MembershipPurchaseFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipPurchaseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipPurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
