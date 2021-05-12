import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YearMonthSelectorComponent } from './year-month-selector.component';

describe('YearMonthSelectorComponent', () => {
  let component: YearMonthSelectorComponent;
  let fixture: ComponentFixture<YearMonthSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YearMonthSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearMonthSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
