import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScheduleDialogComponent } from './add-schedule-dialog.component';

describe('AddScheduleDialogComponent', () => {
  let component: AddScheduleDialogComponent;
  let fixture: ComponentFixture<AddScheduleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScheduleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
