import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommunicationService} from '../communication.service';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {Member} from '../../models/member.model';
import {Router} from '@angular/router';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-find-member',
  templateUrl: './find-member.component.html',
  styleUrls: ['./find-member.component.scss']
})
export class FindMemberComponent implements OnInit, AfterViewInit {
  @ViewChild('searchField') searchInput: ElementRef;
  @Input()
  labelColor = '#FFF';
  @Input()
  placeholder;
  @Input()
  selectedMember: Member;
  @Input()
  clearAfterSelection = false;
  @Output()
  memberSelected: EventEmitter<Member> = new EventEmitter<Member>();
  members$: Observable<Member[]>;
  searchFormControl: FormControl;

  constructor(private communicationService: CommunicationService, private router: Router) {
  }

  displayFn(member: Member) {
    if (member && member.firstName && member.lastName) {
      return `${member.firstName} ${member.lastName} mob: ${member.phoneNumber}`;
    } else {
      return '';
    }

  }

  ngOnInit() {
    this.searchFormControl = new FormControl(this.selectedMember ? this.selectedMember : null);
  }

  ngAfterViewInit(): void {
    this.members$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(search => this.loadMembers((search)))
      );
  }

  memberSelect($event: MatAutocompleteSelectedEvent) {
    this.memberSelected.emit(this.searchFormControl.value);
    if (this.clearAfterSelection) {
      this.searchFormControl.patchValue(null);
    }
  }

  loadMembers(search): Observable<Member[]> {
    return this.communicationService.findMembers(search);
  }

}
