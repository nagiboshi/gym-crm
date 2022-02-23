import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {fromEvent, Observable, of} from 'rxjs';
import {concatMap, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {isEmpty} from 'lodash';
import {Product} from '@models/product';
import {Page} from '@models/page';
import {QueryJoin} from '@nestjsx/crud-request';
import {ProductService} from '../../sales/product/product.service';
import {ProductCrudDialogComponent} from '../../sales/purchase-vouchers/product-crud-dialog/product-crud-dialog.component';
import {HelpersService} from '@shared/helpers.service';

@Component({
  selector: 'find-product',
  templateUrl: './find-product.component.html',
  styleUrls: ['./find-product.component.scss']
})
export class FindProductComponent implements OnInit, AfterViewInit {
  @ViewChild('searchField') searchInput: ElementRef;
  @Input()
  labelColor = '#0000008a';
  @Input()
  placeholder;
  @Input()
  selectedProduct: Product;
  @Input()
  clearAfterSelection = false;
  @Input()
  joinFields: QueryJoin[] = [];
  @Output()
  productSelected: EventEmitter<Product> = new EventEmitter<Product>();
  products$: Observable<Product[]>;
  searchFormControl: FormControl;
  showNewProductOption = false;

  constructor(public dialog: MatDialog, private productService: ProductService, private helpers: HelpersService) {
  }

  displayFn(product: Product) {
    return product?.name;
  }

  ngOnInit() {
    this.searchFormControl = new FormControl(this.selectedProduct ? this.selectedProduct : null);
  }

  ngAfterViewInit(): void {
    this.products$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.showNewProductOption = true;
        }),
        map(event => event.target.value),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(search => this.loadProducts((search))),
        concatMap(productPage => of(productPage?.data))
      );

  }

  productSelect($event: MatAutocompleteSelectedEvent) {
    if (this.searchFormControl.value) {
      this.productSelected.emit(this.searchFormControl.value);
      if (this.clearAfterSelection) {
        this.searchFormControl.patchValue(null);
      }
    }
  }

  loadProducts(search): Observable<Page<Product>> {
    if (!isEmpty(search)) {

      return this.productService.getProducts(10, 0, search, this.joinFields);
    }
    return of(null);
  }

  openNewProductForm() {
    const newProduct = {id: 0, firstName: '', lastName: '', email: '', gender: 'Male', phoneNumber: ''};
    this.searchInput.nativeElement.blur();
    this.showNewProductOption = false;
    this.dialog.open(ProductCrudDialogComponent, {data: newProduct})
      .afterClosed()
      .subscribe(async (submittedProduct: Product) => {
        if (submittedProduct) {
          const savedProduct = await this.productService.save(this.helpers.toFormData(submittedProduct) as any);
          this.productSelected.emit(savedProduct);
        }
      });
  }
}
