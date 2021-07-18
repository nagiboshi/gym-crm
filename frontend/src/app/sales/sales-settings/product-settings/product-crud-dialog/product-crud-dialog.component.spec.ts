import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCrudDialogComponent } from './product-crud-dialog.component';

describe('ProductCrudDialogComponent', () => {
  let component: ProductCrudDialogComponent;
  let fixture: ComponentFixture<ProductCrudDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCrudDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCrudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
