import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FindProductComponent } from './find-product.component';

describe('FindMemberComponent', () => {
  let component: FindProductComponent;
  let fixture: ComponentFixture<FindProductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FindProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
