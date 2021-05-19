import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileChangeEvent} from '@angular/compiler-cli/src/perform_watch';
import {first} from 'lodash';
@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.scss']
})
export class AddMemberDialogComponent implements OnInit {
  title = 'Registering new member';
  memberForm: FormGroup;
  doBorderHighlight: boolean;
  @ViewChild('avatarFileChoose')
  avatarFileChoose: ElementRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.memberForm = this.fb.group({
        id: [0],
        firstName: [this.data.firstName, [Validators.required]],
        lastName: [this.data.lastName, [Validators.required]],
        image: ['', [Validators.required]],
        email: [this.data.lastName, [Validators.email]],
        phoneNumber: [this.data.phoneNumber, null],
        gender: [this.data.gender, null]
      }
    );
  }

  handleAvatar(e: Event ) {
      const fileTarget = (<any>e.target).files;
      if( fileTarget ) {

        this.memberForm.patchValue({image: first(fileTarget)})
      }
  }

  handleAvatarDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.memberForm.patchValue({file: first(e.dataTransfer.files)});
  }

  highlightBorder(e: DragEvent, doHighlight: boolean) {
    e.preventDefault();
    e.stopPropagation();
    this.doBorderHighlight = doHighlight;
  }

  openAvatarFileChoose() {
    this.avatarFileChoose.nativeElement.click();
  }
}
