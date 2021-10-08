import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FindSupplierComponent } from './find-supplier.component';

describe('FindMemberComponent', () => {
  let component: FindSupplierComponent;
  let fixture: ComponentFixture<FindSupplierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FindSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
