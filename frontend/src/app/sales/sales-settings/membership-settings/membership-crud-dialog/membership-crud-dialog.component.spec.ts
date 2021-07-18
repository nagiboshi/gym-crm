import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipCrudDialog } from './membership-crud-dialog.component';

describe('SalesDialogComponent', () => {
  let component: MembershipCrudDialog;
  let fixture: ComponentFixture<MembershipCrudDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipCrudDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipCrudDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
