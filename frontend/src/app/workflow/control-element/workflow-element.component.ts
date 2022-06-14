import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef} from '@angular/core';
import {WorkflowElement} from '../workflow-container/workflow.component';
import {BrowserJsPlumbInstance} from '@jsplumb/browser-ui';
import {WorkflowService} from '../workflow.service';
import {EndpointOptions} from '@jsplumb/core';

@Component({
  selector: 'workflow-element',
  templateUrl: './workflow-element.component.html',
  styleUrls: ['./workflow-element.component.scss']
})
export class WorkflowElementComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  workflowElement: WorkflowElement;

  @Input()
  renderer: BrowserJsPlumbInstance;

  @Output()
  clicked: EventEmitter<WorkflowElement> = new EventEmitter();

  constructor(private vcr: ViewContainerRef, private workflowService: WorkflowService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.renderer) {
      this.renderer.manage(this.vcr.element.nativeElement);
      const endpointsMeta: Array<EndpointOptions<any>> = this.workflowService.getEndpointConfiguration(this.workflowElement.type);
      endpointsMeta.forEach(configuration => this.renderer.addEndpoint(this.vcr.element.nativeElement, configuration));
    }
  }

  ngOnDestroy() {
    // console.log(this.renderer.dragManager)
  }

}
