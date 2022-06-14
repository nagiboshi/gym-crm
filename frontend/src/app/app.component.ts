import {Component} from '@angular/core';
import {Member} from '@models/member';
import {Router} from '@angular/router';
import {UserService} from '@shared/user.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {StockPurchaseService} from './sales/product/product-purchase-form/stock-purchase.service';
import {MembershipGroupService} from '@shared/membership-group.service';
import {PaymentMethodService} from './settings/settings-page/payment-methods-settings/payment-method.service';
import {InventoryItem} from './sales/invetory/inventory-list/inventory-item';
import jwtDecode from 'jwt-decode';
import {UserToken} from '@models/user';
import {CategoryService} from '@shared/category/category.service';
import {ClassesService} from './classes/classes.service';
import {TaxService} from '@shared/tax.service';
import {StockPurchaseFormDialogComponent} from './sales/product/stock-purchase-form-dialog/stock-purchase-form-dialog.component';
import {StockPurchase} from '@models/stock-purchase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userAvatar: string;
  company = {name: 'Primal Gym', logo: '/assets/primal-logo.svg'};
  title = 'primal-accounting';
  isForm: boolean;
  constructor(private router: Router,
              public userService: UserService,
              private http: HttpClient,
              private productPurchaseService: StockPurchaseService,
              private paymentMethodService: PaymentMethodService,
              private categoryService: CategoryService,
              private taxService: TaxService,
              private classService: ClassesService,
              private dialog: MatDialog,
              private membershipGroupService: MembershipGroupService) {


    this.isForm = location.pathname == '/form';
    if (!this.isForm) {
      userService.token$.subscribe((t) => {

        if (t) {
          this.userAvatar = jwtDecode<UserToken>(t.access_token).photoLink;
          taxService.fetchTaxes().subscribe();
          membershipGroupService.fetchMembershipGroups().subscribe();
          paymentMethodService.fetchPaymentMethods().subscribe();
          categoryService.fetchCategories().subscribe();
          classService.fetchClasses().subscribe();
        }
      });
    }
  }

  onMemberFound(member: Member) {
    this.router.navigate([`/members/profile/${member.id}`]);
  }

  logout() {
    this.userService.logout();
  }

  onStockSelected(stock: InventoryItem) {
    this.dialog.open(StockPurchaseFormDialogComponent, {
      data: {
        stock: stock,
        member: null
      }
    }).afterClosed().subscribe((stockPurchase: StockPurchase) => {
      if (stockPurchase) {
        this.productPurchaseService.save(stockPurchase);
      }
    });
  }

}
