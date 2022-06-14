import {Injectable} from '@angular/core';
import {DotEndpoint, EndpointOptions} from '@jsplumb/core';
import {AnchorLocations} from '@jsplumb/common';

export type WorkflowElementType = 'start' | 'end' | 'form' | 'email-output' | 'email-input' | 'split' | 'scheduler';

@Injectable({providedIn: 'root'})
export class WorkflowService {
  configurations: { [s: string]: EndpointOptions[] } = {
    'start': [{
      endpoint: DotEndpoint.type,
      anchor: AnchorLocations.Right,
      source: true,
      maxConnections: 1
    }],
    'end': [{
      endpoint: DotEndpoint.type,
      anchor: AnchorLocations.Left,
      target: true,
      maxConnections: 1
    }],
    'form': [{
      endpoint: DotEndpoint.type,
      maxConnections: 1,
      target: true,
      anchor: AnchorLocations.Left
    }, {
      endpoint: DotEndpoint.type,
      maxConnections: 1,
      source: true,
      anchor: AnchorLocations.Right
    }],
    'email-output': [{
      endpoint: DotEndpoint.type,
      anchor: AnchorLocations.Left,
      maxConnections: 1,
      target: true,
    },
      {
        endpoint: DotEndpoint.type,
        anchor: AnchorLocations.Right,
        maxConnections: 1,
        source: true
      }],
  };


  getEndpointConfiguration(type: WorkflowElementType): Array<EndpointOptions<any>> {
    return this.configurations[type];
  }

}

