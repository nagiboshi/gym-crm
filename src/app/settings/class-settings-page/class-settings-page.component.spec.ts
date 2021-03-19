import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSettingsPageComponent } from './class-settings-page.component';

describe('ClassSettingsPageComponent', () => {
  let component: ClassSettingsPageComponent;
  let fixture: ComponentFixture<ClassSettingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSettingsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
