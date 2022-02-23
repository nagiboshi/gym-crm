import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServicePurchaseFormComponent } from './service-purchase-form.component';

describe('PurchaseFormComponent', () => {
  let component: ServicePurchaseFormComponent;
  let fixture: ComponentFixture<ServicePurchaseFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePurchaseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
