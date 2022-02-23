import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesCrudComponent } from './properties-crud.component';

describe('PropertiesCrudComponent', () => {
  let component: PropertiesCrudComponent;
  let fixture: ComponentFixture<PropertiesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
