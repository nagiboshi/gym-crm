import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersCrudComponent } from './suppliers-crud.component';

describe('SuppliersCrudComponent', () => {
  let component: SuppliersCrudComponent;
  let fixture: ComponentFixture<SuppliersCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
