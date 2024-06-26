import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TimeRangeSelectorComponent } from './time-range-selector/time-range-selector.component';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { YearMonthSelectorComponent } from './year-month-selector/year-month-selector.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MatCommonModule } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AddMemberDialogComponent } from './add-member-dialog/add-member-dialog.component';
import { MembershipExpirationPipe } from './pipes/membership-expiration.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FreezeMembershipDialogComponent } from './freeze-membership-dialog/freeze-membership-dialog.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { MatTreeModule } from '@angular/material/tree';
import { ClassCategoryNamePipe } from './pipes/class-category-name.pipe';
import { DeletePromptDialogComponent } from './delete-prompt-dialog/delete-prompt-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LocalImageLinkPipe } from './pipes/member-photo-link.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BranchNamePipe } from './pipes/branch-name.pipe';
import { HelpersService } from '@shared/helpers.service';
import { SharePurchaseDialogComponent } from './share-purchase-dialog/share-purchase-dialog.component';
import { GlobalErrorDialogComponent } from './global-error-dialog/global-error-dialog.component';
import { GlobalErrorHandlerService } from '@shared/global-error-handler.service';
import { InputPromptDialogComponent } from './input-prompt-dialog/input-prompt-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { DelimeterSeparatedValuePipe } from './pipes/delimeter-separated-value.pipe';
import { FindProductComponent } from '@shared/find-product/find-product.component';
import { PricePipe } from './pipes/price.pipe';
import { TaxPipe } from './pipes/tax.pipe';
import { DiscountPipe } from './pipes/discount.pipe';
import { TotalPricePipe } from '@shared/pipes/total-price';
import { JwtInterceptor } from '../helpers/jwt.interceptor';
import { FindMemberComponent } from '@shared/find-member/find-member.component';
import { FindSupplierComponent } from '@shared/find-supplier/find-supplier.component';
import { PropertiesComponent } from './properties/properties.component';
import { PropertiesCrudComponent } from './properties/properties-crud/properties-crud.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FindItemComponent } from '@shared/find-inventory-item/find-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { StockDetailsPipe } from '@shared/pipes/stock-details.pipe';
import { MatCardModule } from '@angular/material/card';
import { CategoryListComponent } from '@shared/category/category-list.component';
import { CategoriesCrudComponent } from '@shared/category/categories-crud/categories-crud.component';
import { SubcategoryCrudComponent } from '@shared/category/categories-crud/subcategory-crud.component/subcategory-crud.component';
import { PaymentNamePipe } from './payment-name.pipe';
import { SocialAccountsComponent } from './social-accounts/social-accounts.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    TimeRangeSelectorComponent,
    PurchaseHistoryComponent,
    FindSupplierComponent,
    AddMemberDialogComponent,
    FindProductComponent,
    YearMonthSelectorComponent,
    MembershipExpirationPipe,
    ClassCategoryNamePipe,
    StockDetailsPipe,
    TotalPricePipe,
    FindProductComponent,
    FindItemComponent,
    CategoryListComponent,
    SubcategoryCrudComponent,
    CategoriesCrudComponent,
    FindMemberComponent,
    DeletePromptDialogComponent,
    FreezeMembershipDialogComponent,
    LocalImageLinkPipe,
    BranchNamePipe,
    SharePurchaseDialogComponent,
    GlobalErrorDialogComponent,
    InputPromptDialogComponent,
    DelimeterSeparatedValuePipe,
    PricePipe,
    TaxPipe,
    DiscountPipe,
    PropertiesComponent,
    PropertiesCrudComponent,
    CategoryListComponent,
    PaymentNamePipe,
    SocialAccountsComponent,
  ],
  providers: [
    MatIconRegistry,
    TotalPricePipe,
    TaxPipe,
    DatePipe,
    HelpersService,
    GlobalErrorHandlerService,
    DiscountPipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  imports: [
    MatCommonModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DragDropModule,
    MatTreeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatDatepickerModule,
    MatCardModule,
    MatDividerModule,
    FlexLayoutModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatGridListModule,
    MatMomentDateModule,
    MatPaginatorModule,
    FormsModule,
    MatSidenavModule,
  ],
  exports: [
    FlexLayoutModule,
    MatTabsModule,
    MatGridListModule,
    DragDropModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    MatTreeModule,
    HttpClientModule,
    MatTableModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatListModule,
    CategoriesCrudComponent,
    CategoryListComponent,
    // MomentDateModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    TimeRangeSelectorComponent,
    MatSortModule,
    FreezeMembershipDialogComponent,
    FindMemberComponent,
    MatDatepickerModule,
    MatPaginatorModule,
    AddMemberDialogComponent,
    PurchaseHistoryComponent,
    FindItemComponent,
    FindProductComponent,
    MatChipsModule,
    PropertiesComponent,
    InputPromptDialogComponent,
    YearMonthSelectorComponent,
    MembershipExpirationPipe,
    BranchNamePipe,
    ClassCategoryNamePipe,
    DeletePromptDialogComponent,
    LocalImageLinkPipe,
    DelimeterSeparatedValuePipe,
    PricePipe,
    FindProductComponent,
    DiscountPipe,
    TaxPipe,
    StockDetailsPipe,
    TotalPricePipe,
    FindSupplierComponent,
    PropertiesCrudComponent,
    PaymentNamePipe,
    SocialAccountsComponent,
  ],
})
export class SharedModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'schedule-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/schedule-icon.svg')
    );
    iconRegistry.addSvgIcon(
      'sales-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/sales-icon.svg')
    );
    iconRegistry.addSvgIcon(
      'sharePeople',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/share-people.svg')
    );
    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/facebook.svg')
    );
    iconRegistry.addSvgIcon(
      'twitter',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/twitter.svg')
    );
    iconRegistry.addSvgIcon(
      'instagram',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/instagram.svg')
    );
  }
}
