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

@Component({
  selector: 'find-product',
  templateUrl: './find-product.component.html',
  styleUrls: ['./find-product.component.scss']
})
export class FindProductComponent implements OnInit, AfterViewInit {
  @ViewChild('searchField') searchInput: ElementRef;
  @Input()
  labelColor = '#FFF';
  @Input()
  placeholder;
  @Input()
  selectedProduct: Product;
  @Input()
  clearAfterSelection = false;
  @Input()
  joinFields: QueryJoin[];
  @Output()
  productSelected: EventEmitter<Product> = new EventEmitter<Product>();
  products$: Observable<Product[]>;
  searchFormControl: FormControl;
  showNewProductOption = false;

  constructor(public dialog: MatDialog, private productService: ProductService) {
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

      return this.productService.getProducts(10, 0, search);
    }
    return of(null);
  }

  openNewProductForm() {
    // const newProduct  = {id: 0, firstName: '', lastName: '', email: '', gender: 'Male', phoneNumber: ''};
    // this.searchInput.nativeElement.blur();
    // this.showNewProductOption = false;
    // this.dialog.open(AddNew, {data: newMember})
    //   .afterClosed()
    //   .subscribe((newMember: Member) => {
    //     if ( newMember ) {
    //       this.communicationService.saveMember(newMember).toPromise().then((savedMember) => {
    //         this.communicationService.memberCreated.next(savedMember);
    //         this.memberSelected.emit(savedMember);
    //       });
    //     }
    //   });
  }
}
