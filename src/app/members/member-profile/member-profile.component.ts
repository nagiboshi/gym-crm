import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {PurchaseItem} from '../../models/purchase.model';
import {ActivatedRoute} from '@angular/router';
import {PurchaseFormComponent} from '../../sales/purchase-form/purchase-form.component';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CommunicationService} from '../../shared/communication.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Member} from '../../models/member.model';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
})
export class MemberProfileComponent implements OnDestroy, OnInit {
  purchasesSubj: BehaviorSubject<PurchaseItem[]> = new BehaviorSubject(null);
  dataSource: MatTableDataSource<PurchaseItem>;
  loadedMember: Member;
  private routeChangeSub: Subscription;
  form: FormGroup;

  constructor(public dialog: MatDialog, private fb: FormBuilder,
              private communicationService: CommunicationService,
              private activatedRoute: ActivatedRoute) {
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
      // this.loadedProfile.referalType
      this.form = this.initForm();
    });
    this.communicationService.getMemberPurchases(memberId)
      .toPromise()
      .then(purchaseItems => this.purchasesSubj.next(purchaseItems));
  }

  addNewPurchase() {
    this.dialog.open(PurchaseFormComponent).afterClosed().subscribe((purchase: PurchaseItem) => {
      const savedPurchaseItem = this.communicationService.savePurchase(purchase);
      savedPurchaseItem.toPromise().then((purchaseItem) => {
        this.purchasesSubj.next([purchaseItem, ...this.purchasesSubj.getValue()]);
      });
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
