import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Member} from './models/member';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {UserService} from '@shared/user.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Package} from '@models/package';
import {ClassModel} from './classes/class.model';
import {PaymentMethod} from '@models/payment-method';
import {ClassCategory} from './classes/class.category';
import {Branch} from '@models/branch';
import {CommunicationService} from '@shared/communication.service';

interface AppRoute {
  label: string;
  path: string;
  isActive: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  cacheLoadingStatus: boolean = true;
  appRoutes$: BehaviorSubject<AppRoute[]> = new BehaviorSubject([{label: 'Schedules', isActive: false, path: '/classes/schedules'},
    {label: 'Members', isActive: false,  path: '/members'}
  ]);
  title = 'primal-accounting';
  constructor(private router: Router,
              public userService: UserService,
              private http: HttpClient,
              private commService: CommunicationService) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const appRoutes = this.appRoutes$.getValue();
        appRoutes.forEach((route) => {
          route.isActive = false;
        });

        if ( e.url == '/') {
          appRoutes[0].isActive = true;
        } else {
          appRoutes.forEach((route) => {
            const urlSegment = '/' + e.url.split('/')[1];
            route.isActive = e.url == route.path || route.path.startsWith(urlSegment);
          });

        }
        this.appRoutes$.next([...appRoutes]);
      }
    });
  }

  onMemberFound(member: Member) {
    this.router.navigate([`/members/${member.id}`]);
  }


  logout() {
    this.userService.logout();
  }

  ngOnInit(): void {
    Promise.all([this.http.get<Package[]>('/api/package').toPromise(),
      this.http.get<ClassModel[]>('/api/classes').toPromise(),
      this.http.get<PaymentMethod[]>('/api/payment-method').toPromise(),
      this.http.get<ClassCategory[]>('/api/class-category').toPromise(),
      this.http.get<Branch[]>('/api/branch').toPromise()])
      .then(([memberships, classes, paymentMethods, classCategories, branches]) => {
        this.commService.classesSubj.next(classes);
        this.commService.packagesSubj.next(memberships);
        this.commService.paymentMethodsSubj.next(paymentMethods);
        this.commService.classCategoriesSubj.next(classCategories);
        this.commService.branchesSubj.next(branches);
      }).finally(() => {
      this.cacheLoadingStatus = false;
    });
  }
}
