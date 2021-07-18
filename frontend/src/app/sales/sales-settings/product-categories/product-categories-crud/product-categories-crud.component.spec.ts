import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoriesCrudComponent } from './product-categories-crud.component';

describe('ProductCategoriesCrudComponent', () => {
  let component: ProductCategoriesCrudComponent;
  let fixture: ComponentFixture<ProductCategoriesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCategoriesCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoriesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
