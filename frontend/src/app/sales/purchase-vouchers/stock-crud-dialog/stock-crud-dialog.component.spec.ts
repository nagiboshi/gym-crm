import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCrudDialogComponent } from './stock-crud-dialog.component';

describe('ProductCrudDialogComponent', () => {
  let component: StockCrudDialogComponent;
  let fixture: ComponentFixture<StockCrudDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockCrudDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCrudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
