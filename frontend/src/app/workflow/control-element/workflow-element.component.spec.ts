import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowElementComponent } from './workflow-element.component';

describe('ControlElementComponent', () => {
  let component: WorkflowElementComponent;
  let fixture: ComponentFixture<WorkflowElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
