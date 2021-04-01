import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FindMemberComponent } from './find-member.component';

describe('FindMemberComponent', () => {
  let component: FindMemberComponent;
  let fixture: ComponentFixture<FindMemberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FindMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
