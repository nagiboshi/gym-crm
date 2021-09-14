import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MembershipGroup} from '@models/membership-group';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {Membership} from '@models/membership';

@Component({
  selector: 'membership-crud-dialog',
  templateUrl: './membership-crud-dialog.component.html',
  styleUrls: ['./membership-crud-dialog.component.scss']
})
export class MembershipCrudDialog implements OnInit {
  formGroup: FormGroup;
  membershipsArray: FormArray;

  constructor(@Inject(MAT_DIALOG_DATA) public membershipGroup: MembershipGroup,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<MembershipCrudDialog>,
              private dialog: MatDialog) {

    this.membershipsArray = new FormArray([]);

    membershipGroup.memberships.forEach((item) => {
      this.membershipsArray.push(
        this.newMembershipFormGroup(item)
      );
    });

    this.formGroup = fb.group({
      id: this.membershipGroup.id,
      name: [this.membershipGroup.name, Validators.required],
      memberships: this.membershipsArray
    });
  }


  newMembershipFormGroup(item?: Membership) {
    return this.fb.group({
      id: [item?.id ?? 0],
      name: [item?.name, [Validators.required]],
      isShared: [item?.isShared??false],
      numberOfParticipants  : [item?.numberOfParticipants ?? 1, [Validators.required]],
      expirationType: [item?.expirationType, Validators.required],
      expirationLength: [item?.expirationLength, Validators.required],
    })
  }

  submit() {
    this.dialogRef.close(this.formGroup.value);
  }

  ngOnInit(): void {
  }

  showDeletePrompt(index: number, formValue: any) {
      this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove membership ${formValue.name} ?` }).afterClosed().subscribe((doRemove) => {
        if( doRemove ) {
            this.membershipsArray.removeAt(index);
            this.formGroup.markAsDirty();
        }
      })
  }

  addMembership() {
    this.membershipsArray.push(this.newMembershipFormGroup())
  }
}
