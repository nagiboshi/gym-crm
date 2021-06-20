import {Component, Input, OnInit} from '@angular/core';
import {PurchaseHistoryItem} from '@models/purchase';
import {Member} from '@models/member';
import {Router} from '@angular/router';

@Component({
  selector: 'membership-status',
  templateUrl: './membership-status.component.html',
  styleUrls: ['./membership-status.component.scss']
})
export class MembershipStatusComponent implements OnInit {
  @Input()
  member: Member;

  @Input()
  activeMembership: PurchaseHistoryItem;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  openMemberPage(sharedMember: Member) {
    this.router.navigate([`/members/${sharedMember.id}`]);
  }
}
