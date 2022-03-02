import { Component, OnInit} from '@angular/core';
import {Member} from '@models/member';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject } from 'rxjs';
import {UserService} from '@shared/user.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {StockPurchaseFormComponent} from './sales/product/product-purchase-form/stock-purchase-form.component';
import {StockPurchaseService} from './sales/product/product-purchase-form/stock-purchase.service';
import {MembershipGroupService} from '@shared/membership-group.service';
import {PaymentMethodService} from './settings/settings-page/payment-methods-settings/payment-method.service';
import {InventoryItem} from './sales/invetory/inventory-list/inventory-item';
import jwtDecode from 'jwt-decode';
import {UserToken} from '@models/user';
import {CategoryService} from '@shared/category/category.service';
import {ClassesService} from './classes/classes.service';

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
export class AppComponent {
  cacheLoadingStatus: boolean = false;
  appRoutes$: BehaviorSubject<AppRoute[]> = new BehaviorSubject([//{label: 'Schedules', isActive: false, path: '/classes/schedules'},
    {label: 'Dashboard', isActive: false, path: '/dashboard'},
    {label: 'Members', isActive: false, path: '/members'},
    {label: 'Sales', isActive: false, path: '/sales'}
  ]);
  userAvatar: string;
  activeRoute: AppRoute;
  company = {name: 'Primal Gym', logo: "/assets/primal-logo.svg"};
  title = 'primal-accounting';

  constructor(private router: Router,
              public userService: UserService,
              private http: HttpClient,
              private productPurchaseService: StockPurchaseService,
              private paymentMethodService: PaymentMethodService,
              private categoryService: CategoryService,
              private classService: ClassesService,
              private dialog: MatDialog,
              private membershipGroupService: MembershipGroupService) {
    userService.token$.subscribe((t) => {

      if(t) {
        this.userAvatar = jwtDecode<UserToken>(t.access_token).photoLink;

        membershipGroupService.fetchMembershipGroups().subscribe();
        paymentMethodService.fetchPaymentMethods().subscribe();
        categoryService.fetchCategories().subscribe();
        classService.fetchClasses().subscribe();
      }
    })
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const appRoutes = this.appRoutes$.getValue();
        appRoutes.forEach((route) => {
          route.isActive = false;
        });

        if (e.url == '/') {
          appRoutes[0].isActive = true;
          this.activeRoute = appRoutes[0];
        } else {
          appRoutes.forEach((route) => {
            const urlSegment = '/' + e.url.split('/')[1];
            route.isActive = e.url == route.path || route.path.startsWith(urlSegment);
            if( route.isActive ) {
              this.activeRoute = route;
            }
          });

        }
        this.appRoutes$.next([...appRoutes]);
      }
    });
  }

  onMemberFound(member: Member) {
    this.router.navigate([`/members/profile/${member.id}`]);
  }

  logout() {
    this.userService.logout();
  }

  onStockSelected(stock: InventoryItem) {
    this.dialog.open(StockPurchaseFormComponent, {data: {stock: stock, member: null}});
  }
}
