import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-global-error-dialog',
  templateUrl: './global-error-dialog.component.html',
  styleUrls: ['./global-error-dialog.component.scss']
})
export class GlobalErrorDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public error: string) { }

  ngOnInit(): void {
  }

}
