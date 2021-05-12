import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Member} from '../../../models/member';
import {CommunicationService} from '@shared/communication.service';

@Component({
  selector: 'family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss']
})
export class FamilyMembersComponent implements OnInit {
  @Input()
  members: Member[] = [];
  @Output()
  afterFamilyMemberSelected: EventEmitter<Member> = new EventEmitter<Member>();
  @Output()
  afterFamilyMemberRemove: EventEmitter<Member> = new EventEmitter<Member>();
  constructor(private memberService: CommunicationService) {
  }

  ngOnInit(): void {
    if ( !this.members ) {
      this.members = [];
    }
  }

  removeFamilyMember(member: Member) {
    this.afterFamilyMemberRemove.emit(member);
  }

  doesMemberExist(member: Member) {
    return this.members.find(m => m.id == member.id) != null;
  }

  addMemberToFamily(member: Member) {
    if ( !this.doesMemberExist(member)) {
      this.afterFamilyMemberSelected.emit(member);
    }
  }

}
