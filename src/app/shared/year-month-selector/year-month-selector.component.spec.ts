import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearMonthSelectorComponent } from './year-month-selector.component';

describe('YearMonthSelectorComponent', () => {
  let component: YearMonthSelectorComponent;
  let fixture: ComponentFixture<YearMonthSelectorComponent>;

  beforeEach(async(() => {
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
