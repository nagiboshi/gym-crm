import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezeMembershipDialogComponent } from './freeze-membership-dialog.component';

describe('FreezeMembershipDialogComponent', () => {
  let component: FreezeMembershipDialogComponent;
  let fixture: ComponentFixture<FreezeMembershipDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezeMembershipDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezeMembershipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
