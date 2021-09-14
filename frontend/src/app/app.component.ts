import { Component, OnInit} from '@angular/core';
import {Member} from '@models/member';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject } from 'rxjs';
import {UserService} from '@shared/user.service';
import {HttpClient} from '@angular/common/http';
import {PaymentMethodService} from './settings/settings-page/payment-methods-settings/payment-method.service';
import {ClassesService} from './classes/classes.service';
import {MembershipGroupService} from '@shared/membership-group.service';
import {Stock} from '@models/stock';
import {MatDialog} from '@angular/material/dialog';
import {StockPurchaseFormComponent} from './sales/stock/stock-purchase-form/stock-purchase-form.component';

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
  appRoutes$: BehaviorSubject<AppRoute[]> = new BehaviorSubject([//{label: 'Schedules', isActive: false, path: '/classes/schedules'},
    {label: 'Dashboard', isActive: false, path: '/dashboard'},
    {label: 'Members', isActive: false, path: '/members'},
    {label: 'Sales', isActive: false, path: '/sales'}
  ]);
  title = 'primal-accounting';

  constructor(private router: Router,
              public userService: UserService,
              private http: HttpClient,
              private dialog: MatDialog,
              private membershipGroupService: MembershipGroupService,
              private paymentService: PaymentMethodService,
              private classesService: ClassesService) {
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

  onStockFound(stock: Stock) {
    this.dialog.open(StockPurchaseFormComponent, {data: stock, width: '80%', minHeight: '80%'});
  }


  logout() {
    this.userService.logout();
  }

  loadCache() {
    this.cacheLoadingStatus = true;
    Promise.all([
      // this.classesService.fetchClasses().toPromise(),
      this.paymentService.fetchPaymentMethods().toPromise(),
      this.membershipGroupService.fetchMembershipGroups().toPromise()]) // ,
  //    this.classesService.fetchClassCategories().toPromise()])
  .finally(() => {
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
