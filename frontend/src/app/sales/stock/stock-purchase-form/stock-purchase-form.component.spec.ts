import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPurchaseFormComponent } from './stock-purchase-form.component';

describe('ProductPurchaseFormComponent', () => {
  let component: StockPurchaseFormComponent;
  let fixture: ComponentFixture<StockPurchaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockPurchaseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockPurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
