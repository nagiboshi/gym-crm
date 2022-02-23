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
import {InventoryItem} from '../../sales/invetory/inventory-list/inventory-item';
import {InventoryService} from '../../sales/invetory/inventory.service';

@Component({
  selector: 'find-inventory-item',
  templateUrl: './find-item.component.html',
  styleUrls: ['./find-item.component.scss']
})
export class FindItemComponent implements OnInit, AfterViewInit {
  @ViewChild('searchField') searchInput: ElementRef;
  @Input()
  labelColor = '#A1A1A1';
  @Input()
  placeholder;
  @Input()
  selectedItem: InventoryItem;
  @Input()
  clearAfterSelection = false;
  @Input()
  joinFields: QueryJoin[];
  @Output()
  stockSelected: EventEmitter<InventoryItem> = new EventEmitter<InventoryItem>();
  items$: Observable<InventoryItem[]>;
  searchFormControl: FormControl;
  showNewProductOption = false;

  constructor(public dialog: MatDialog, private service: InventoryService) {
  }

  displayFn(stock: InventoryItem) {
    return stock?.product.name;
  }

  ngOnInit() {
    this.searchFormControl = new FormControl(this.selectedItem ? this.selectedItem : null);
  }

  ngAfterViewInit(): void {
    this.items$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.showNewProductOption = true;
        }),
        map(event => event.target.value),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(search => this.loadItems((search))),
        concatMap(productPage => of(productPage?.data))
      );

  }

  stockSelect($event: MatAutocompleteSelectedEvent) {
    if (this.searchFormControl.value) {
      this.stockSelected.emit(this.searchFormControl.value);
      if (this.clearAfterSelection) {
        this.searchFormControl.patchValue(null);
      }
    }
  }

  loadItems(search): Observable<Page<InventoryItem>> {
    if (!isEmpty(search)) {

      return this.service.getItems(10, 0, search);
    }
    return of(null);
  }

}
