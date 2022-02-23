import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {Inject, Injectable, Scope} from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  constructor(@Inject(REQUEST) public readonly request: Request) {}
}
