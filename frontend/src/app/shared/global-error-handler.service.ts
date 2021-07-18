import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {GlobalErrorDialogComponent} from '@shared/global-error-dialog/global-error-dialog.component';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler{

  constructor(private dialog: MatDialog, private zone: NgZone) { }

  handleError(error: Error): void {
    console.error(error);
    this.zone.run(() => this.dialog.open(GlobalErrorDialogComponent, {data: error.message || 'Undefined client error'}) );
  }
}
