import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PurchaseItem} from '../../models/purchase.model';
import {ActivatedRoute} from '@angular/router';
import {PurchaseFormComponent} from '../../sales/purchase-form/purchase-form.component';
import {BehaviorSubject, Subscription} from 'rxjs';
import {CommunicationService} from '../../shared/communication.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Member} from '../../models/member.model';
import {FreezeMembershipDialogComponent} from '../../shared/freeze-membership-dialog/freeze-membership-dialog.component';
import {Freeze} from '../../models/freeze.model';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberProfileComponent implements OnDestroy, OnInit {
  loadedMember: Member;
  private routeChangeSub: Subscription;
  form: FormGroup;

  constructor(public dialog: MatDialog, private fb: FormBuilder,
              private communicationService: CommunicationService,
              private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef) {
  }


  @HostListener('window:beforeunload', ['$event'])
  checkChangesAndNotifyUser($event) {
    if (this.form.touched) {
      $event.returnValue = 'You made a changes, but didn\'t save them';
    }
  }

  ngOnInit() {
    const id = parseInt(this.activatedRoute.snapshot.params.id, 10);
    this.loadProfile(id);
    this.routeChangeSub = this.activatedRoute.url.subscribe(urlSegment => this.loadProfile(parseInt(urlSegment[1].toString(), 10)));
  }

  initForm() {
    return this.fb.group(
      {
        firstName: new FormControl(this.loadedMember.firstName, Validators.required),
        lastName: new FormControl(this.loadedMember.lastName, Validators.required),
        notes: new FormControl(this.loadedMember.notes),
        referalType: new FormControl(this.loadedMember.referalType),
        email: new FormControl(this.loadedMember.email, Validators.email),
        phoneNumber: new FormControl(this.loadedMember.phoneNumber, Validators.required)
      }
    );
  }

  loadProfile(memberId: number) {
    this.communicationService.getMember(memberId.toString()).toPromise().then((member) => {
      this.loadedMember = member;
      this.form = this.initForm();
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.routeChangeSub.unsubscribe();
  }

  patchFamilyField() {
    if (!this.loadedMember.family) {
      this.loadedMember.family = [];
    }
  }

  updateMember() {
    if (this.form.valid) {
      this.loadedMember = Object.assign(this.loadedMember, this.form.value);
      this.communicationService.updateMember(this.loadedMember);
      this.form = this.initForm();
      this.cd.markForCheck();
    }
  }

  removeFamilyMember(member: Member) {
    this.patchFamilyField();
    const index = this.loadedMember.family.findIndex(m => m.id == member.id);
    this.loadedMember.family.splice(index, 1);
    this.form.markAllAsTouched();
  }

  addMemberToFamily(member: Member) {
    if (member.id != this.loadedMember.id) {
      this.patchFamilyField();
      this.loadedMember.family.push(member);
      this.communicationService.updateMember(this.loadedMember);
      this.form.markAllAsTouched();
    }
  }



}
