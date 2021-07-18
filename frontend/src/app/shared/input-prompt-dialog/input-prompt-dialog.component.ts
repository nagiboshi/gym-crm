import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface InputPromptData {
  value: string;
  title: string;
}

@Component({
  selector: 'app-input-prompt-dialog',
  templateUrl: './input-prompt-dialog.component.html',
  styleUrls: ['./input-prompt-dialog.component.scss']
})
export class InputPromptDialogComponent implements OnInit {
  inputControl: FormControl;
  constructor(@Inject(MAT_DIALOG_DATA) public data: InputPromptData) { }

  ngOnInit(): void {
    this.inputControl = new FormControl(this.data.value, [Validators.required, Validators.minLength(1)]);
  }
}
