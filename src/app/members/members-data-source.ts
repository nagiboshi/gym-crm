import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Member} from '../models/member.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {CommunicationService} from '../shared/communication.service';

export class MembersDataSource implements DataSource<Member> {
  private _size = 20;
  private _offset = 0;
  membersSubject = new BehaviorSubject<Member[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private com: CommunicationService) {
  }

  set size(size: number) {
    this._size = size;
  }

  set offset(offset: number) {
    this._offset = offset;
  }

  connect(collectionViewer: CollectionViewer): Observable<Member[]> {
    return this.membersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.membersSubject.complete();
    this.loadingSubject.complete();
  }

  loadMembers(filter = '',
              sortDirection = 'asc', pageIndex = 0, pageSize = 20) {

    this.loadingSubject.next(true);
    this.com.getMembers(pageSize, filter, (pageIndex) * pageSize).subscribe(members => {
      this.membersSubject.next(members);
    });
  }
}
