import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassTypesComponent } from './class-types.component';

describe('ClassTypesComponent', () => {
  let component: ClassTypesComponent;
  let fixture: ComponentFixture<ClassTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
