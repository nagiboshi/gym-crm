import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ClassModel} from '../../../../classes/class.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CommunicationService} from '../../../../shared/communication.service';
import {remove} from 'lodash';
export class ClassesDataSource extends DataSource<ClassModel> {
  data: BehaviorSubject<ClassModel[]>;
  constructor(private communicationService: CommunicationService) {
    super();
    this.data =  new BehaviorSubject([...this.communicationService.getClasses()]);
  }

  connect(collectionViewer: CollectionViewer): Observable<ClassModel[] | ReadonlyArray<ClassModel>> {
    return this.data.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  updateClasses(classes: ClassModel[]) {
    this.data.next([...this.communicationService.getClasses()]);
  }

  filterByClassType(categoryId: number) {
    this.data.next([...this.communicationService.getClasses()].filter((c => categoryId == -1 || c.categoryId == categoryId)));
  }
}
