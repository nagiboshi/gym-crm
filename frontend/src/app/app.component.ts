import { Component, OnInit} from '@angular/core';
import {Member} from '@models/member';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject } from 'rxjs';
import {UserService} from '@shared/user.service';
import {HttpClient} from '@angular/common/http';
import {CommunicationService} from '@shared/communication.service';
import {PaymentMethodService} from './settings/settings-page/payment-methods-settings/payment-method.service';
import {ClassesService} from './classes/classes.service';
import {ProductCategoriesService} from '@shared/product-categories.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

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
  cacheLoadingStatus: boolean = false;
  appRoutes$: BehaviorSubject<AppRoute[]> = new BehaviorSubject([{label: 'Schedules', isActive: false, path: '/classes/schedules'},
    {label: 'Members', isActive: false, path: '/members'}
  ]);
  title = 'primal-accounting';

  constructor(private router: Router,
              public userService: UserService,
              private http: HttpClient,
              private productCategoriesService: ProductCategoriesService,
              private paymentService: PaymentMethodService,
              private classesService: ClassesService,
              private domSanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry,
              private commService: CommunicationService) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const appRoutes = this.appRoutes$.getValue();
        appRoutes.forEach((route) => {
          route.isActive = false;
        });

        if (e.url == '/') {
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

  loadCache() {
    this.cacheLoadingStatus = true;
    Promise.all([
      this.classesService.fetchClasses().toPromise(),
      this.paymentService.fetchPaymentMethods().toPromise(),
      this.productCategoriesService.fetchProductCategories().toPromise(),
      this.classesService.fetchClassCategories().toPromise()]).finally(() => {
      this.cacheLoadingStatus = false;
    });
  }

  ngOnInit(): void {
     this.userService.token$.subscribe((token) => {
      if (token && !this.cacheLoadingStatus) {
        this.loadCache();
      }
    });
  }
}
