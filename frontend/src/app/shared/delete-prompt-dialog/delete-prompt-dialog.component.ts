import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'delete-prompt-dialog',
  templateUrl: './delete-prompt-dialog.component.html',
  styleUrls: ['./delete-prompt-dialog.component.scss']
})
export class DeletePromptDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public prompt: string) { }

  ngOnInit(): void {
  }

}
