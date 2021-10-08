import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FindStockComponent } from './find-stock.component';

describe('FindMemberComponent', () => {
  let component: FindStockComponent;
  let fixture: ComponentFixture<FindStockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FindStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
