import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPurchaseFormDialogComponent } from './stock-purchase-form-dialog.component';

describe('StockPurchaseFormDialogComponent', () => {
  let component: StockPurchaseFormDialogComponent;
  let fixture: ComponentFixture<StockPurchaseFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockPurchaseFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockPurchaseFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
