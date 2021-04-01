import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClassSettingsComponent } from './class-settings.component';

describe('ClassSettingsComponent', () => {
  let component: ClassSettingsComponent;
  let fixture: ComponentFixture<ClassSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
