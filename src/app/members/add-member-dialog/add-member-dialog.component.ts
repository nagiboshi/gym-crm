import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.scss']
})
export class AddMemberDialogComponent implements OnInit {
  title = 'Registering new member';
  memberForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.memberForm = this.fb.group({
      firstName: [this.data.firstName, [Validators.required]],
      lastName: [this.data.lastName, [Validators.required]],
      email: [this.data.lastName, [Validators.email]],
      phoneNumber: [this.data.phoneNumber, null],
      gender: [this.data.gender, null]
      }
    );
  }

}
