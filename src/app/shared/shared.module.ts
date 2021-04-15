import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {TimeRangeSelectorComponent} from './time-range-selector/time-range-selector.component';
import {CommonModule, DatePipe} from '@angular/common';
import {fakeBackendProvider} from './fake-backend.service';
import {HttpClientModule} from '@angular/common/http';
import {FindMemberComponent} from './find-member/find-member.component';
import {YearMonthSelectorComponent} from './year-month-selector/year-month-selector.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule, MomentDateModule} from '@angular/material-moment-adapter';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {DomSanitizer} from '@angular/platform-browser';
import {AddMemberDialogComponent} from './add-member-dialog/add-member-dialog.component';
import {MembershipExpirationPipe} from './pipes/membership-expiration.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FreezeMembershipDialogComponent} from './freeze-membership-dialog/freeze-membership-dialog.component';
import {PurchaseHistoryComponent} from './purchase-history/purchase-history.component';
import {MatTreeModule} from '@angular/material/tree';
import {ClassCategoryNamePipe} from './pipes/class-category-name.pipe';
import {DeletePromptDialogComponent} from './delete-prompt-dialog/delete-prompt-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [TimeRangeSelectorComponent, PurchaseHistoryComponent,
    AddMemberDialogComponent, FindMemberComponent, YearMonthSelectorComponent,
    MembershipExpirationPipe, ClassCategoryNamePipe, DeletePromptDialogComponent, FreezeMembershipDialogComponent],
  providers: [fakeBackendProvider, MatIconRegistry, DatePipe, {
    provide: MAT_DATE_FORMATS, useValue: {
      parse: {
        dateInput: 'LL',
      },
      display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    }
  }],
  imports: [
    CommonModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTreeModule,
    MatDialogModule,
    MatDatepickerModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMomentDateModule,
    MatPaginatorModule,
    FormsModule
  ],
  exports: [
    FlexLayoutModule,
    MatTabsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatTreeModule,
    HttpClientModule,
    MatTableModule,
    MatCheckboxModule,
    // MomentDateModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    TimeRangeSelectorComponent,
    MatSortModule,
    FreezeMembershipDialogComponent,
    MatDatepickerModule,
    MatPaginatorModule,
    AddMemberDialogComponent,
    PurchaseHistoryComponent,
    FindMemberComponent,
    YearMonthSelectorComponent,
    MembershipExpirationPipe,
    ClassCategoryNamePipe,
    DeletePromptDialogComponent
  ]
})
export class SharedModule {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('schedule-icon', sanitizer.bypassSecurityTrustResourceUrl('/assets/schedule-icon.svg'));
  }
}
