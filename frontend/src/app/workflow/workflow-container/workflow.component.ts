import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {newInstance,  BrowserJsPlumbInstance} from '@jsplumb/browser-ui';
import {FlowchartConnector} from '@jsplumb/connector-flowchart';
import {WorkflowElementType, WorkflowService} from '../workflow.service';
import {clone} from 'lodash';

export interface WorkflowElement {
   title: string;
   type: WorkflowElementType;
   elementType: 'trigger' | 'control' | 'output';
   options: any;
   x?: number;
   y?: number;
}

@Component({
  selector: 'workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})

export class WorkflowComponent implements OnInit, AfterViewInit {
  workflowDrawer:BrowserJsPlumbInstance;
  workflow: Array<WorkflowElement> = [];
  @ViewChild('workflowContainer')
  workflowContainer: ElementRef;
  menuControlElements: WorkflowElement[] = [
    {elementType: "control", type:'start', title: 'Start', options:{}},
    {elementType: "control", type:'end', title: 'End', options:{}},
    {elementType: "control", type:'split', title: 'Split', options:{}},
    {elementType: "control", type:'scheduler', title: 'Scheduler', options:{}}
  ];
  menuInputElements: WorkflowElement[] = [
    {elementType: "trigger", type: 'form', title: 'Form', options: {}},
  ];

  menuOutputElements: WorkflowElement[] = [
    {elementType: "output", type: 'email-output', title: 'Email', options: {}},
  ];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.workflowDrawer =  newInstance({
      container: this.workflowContainer.nativeElement,
      connector: {type: FlowchartConnector.type, options:{}},
      dragOptions: {cursor: 'move'},
      paintStyle: {strokeWidth: 1, stroke: '#456'},
      elementsDraggable: true }, );

    this.workflowDrawer.bind('connection', (ev) => {
      console.log("Connection have been made !", ev);
    });

    this.workflowDrawer.bind('connectionDetached', (ev) => {
      console.log("Connection have been detached", ev);
    })

  }

  addElement(workflowElement: WorkflowElement) {
      console.log(workflowElement);
      const worklfowElementCpy = clone(workflowElement);
      worklfowElementCpy.x = 50;
      worklfowElementCpy.y = 50;
      // this.workflowDrawer.
      this.workflow.push(worklfowElementCpy);

  }
}
