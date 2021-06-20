import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMergeDialogComponent } from './user-merge-dialog.component';

describe('UserMergeDialogComponent', () => {
  let component: UserMergeDialogComponent;
  let fixture: ComponentFixture<UserMergeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMergeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMergeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
