import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable, of, Subject, Subscription} from 'rxjs';
import {CommunicationService} from '@shared/communication.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Member} from '@models/member';
import * as _moment from 'moment';
import {first, sortBy, isEmpty } from 'lodash';
import {PurchaseHistoryItem} from '@models/purchase';
import {SalesService} from '../../sales/sales.service';

const moment = _moment;

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberProfileComponent implements OnDestroy, OnInit {
  _loadedMemberSubject: BehaviorSubject<Member>;
  _activeMembership: BehaviorSubject<PurchaseHistoryItem>;
  _activeMembership$: Observable<PurchaseHistoryItem>;
  private routeChangeSub: Subscription;
  form: FormGroup;
  todayMoment = moment().startOf('day');

  constructor(public dialog: MatDialog, private fb: FormBuilder,
              private communicationService: CommunicationService,
              private activatedRoute: ActivatedRoute,
              private salesService: SalesService,
              private cd: ChangeDetectorRef) {
  }


  @HostListener('window:beforeunload', ['$event'])
  checkChangesAndNotifyUser($event) {
    if (this.form.touched) {
      $event.returnValue = 'You made a changes, but didn\'t save them';
    }
  }

  ngOnInit() {
    this._loadedMemberSubject = new BehaviorSubject(null);
    this._activeMembership = new BehaviorSubject(null);
    this._activeMembership$ = this._activeMembership.asObservable();
    this.routeChangeSub = this.activatedRoute.url.subscribe(urlSegment => this.loadProfile(parseInt(first(urlSegment).path)) );
  }

  initForm() {
    const member = this.loadedMemberValue;
    return this.fb.group(
      {
        firstName: new FormControl(member.firstName, Validators.required),
        lastName: new FormControl(member.lastName, Validators.required),
        notes: new FormControl(member.notes),
        referalType: new FormControl(member.referalType),
        email: new FormControl(member.email, Validators.email),
        phoneNumber: new FormControl(member.phoneNumber, Validators.required)
      }
    );
  }

  loadProfile(memberId: number) {
    this.communicationService.getMemberWithPurchases(memberId.toString()).toPromise().then((member) => {
      if( member ) {
        this._loadedMemberSubject.next( member );
        this._activeMembership.next(this.getActiveMembership(member));
        this.form = this.initForm();
        this.cd.markForCheck();
      }
    });
  }

  get loadedMemberValue() {
    return this._loadedMemberSubject.getValue();
  }


  get loadedMember$(): Observable<Member> {
    return this._loadedMemberSubject.asObservable();
  }

  getActiveMembership(member: Member) {
    if( isEmpty(member.purchaseItems)) {
      return null;
    }
   return this.salesService.toPurchaseHistoryItem(first(member.purchaseItems), this.todayMoment);
  }

  ngOnDestroy() {
    this.routeChangeSub.unsubscribe();
  }

  updateMember() {
    if (this.form.valid) {
      this._loadedMemberSubject.next(Object.assign(this.loadedMemberValue, this.form.value));
      this.communicationService.updateMember(this.loadedMemberValue);
      this._activeMembership.next(this.getActiveMembership(this.loadedMemberValue));
      this.form = this.initForm();
      this.cd.markForCheck();
    }
  }

  onNewPurchase(purchaseHistoryItem: PurchaseHistoryItem) {
      this._activeMembership.next(purchaseHistoryItem);
  }
}
