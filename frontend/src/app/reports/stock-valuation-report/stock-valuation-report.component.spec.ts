import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockValuationReportComponent } from './stock-valuation-report.component';

describe('StockValuationReportComponent', () => {
  let component: StockValuationReportComponent;
  let fixture: ComponentFixture<StockValuationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockValuationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockValuationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
