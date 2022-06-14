import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOutletComponent } from './form-outlet.component';

describe('FormOutletComponent', () => {
  let component: FormOutletComponent;
  let fixture: ComponentFixture<FormOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
