import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {fromEvent, Observable, of} from 'rxjs';
import {concatMap, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {isEmpty} from 'lodash';
import {Stock} from '@models/stock';
import {Page} from '@models/page';
import {QueryJoin} from '@nestjsx/crud-request';
import {StockService} from '../../sales/stock/stock.service';

@Component({
  selector: 'find-stock',
  templateUrl: './find-stock.component.html',
  styleUrls: ['./find-stock.component.scss']
})
export class FindStockComponent implements OnInit, AfterViewInit {
  @ViewChild('searchField') searchInput: ElementRef;
  @Input()
  labelColor = '#FFF';
  @Input()
  placeholder;
  @Input()
  selectedStock: Stock;
  @Input()
  clearAfterSelection = false;
  @Input()
  joinFields: QueryJoin[];
  @Output()
  stockSelected: EventEmitter<Stock> = new EventEmitter<Stock>();
  stocks$: Observable<Stock[]>;
  searchFormControl: FormControl;
  showNewStockOption = false;

  constructor(public dialog: MatDialog, private stockService: StockService) {
  }

  displayFn(stock: Stock) {
    return stock?.name;
  }

  ngOnInit() {
    this.searchFormControl = new FormControl(this.selectedStock ? this.selectedStock : null);
  }

  ngAfterViewInit(): void {
    this.stocks$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.showNewStockOption = true;
        }),
        map(event => event.target.value),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(search => this.loadStocks((search))),
        concatMap(stockPage => of(stockPage?.data))
      );

  }

  productSelect($event: MatAutocompleteSelectedEvent) {
    if (this.searchFormControl.value) {
      this.stockSelected.emit(this.searchFormControl.value);
      if (this.clearAfterSelection) {
        this.searchFormControl.patchValue(null);
      }
    }
  }

  loadStocks(search): Observable<Page<Stock>> {
    if (!isEmpty(search)) {

      return this.stockService.getStocks(10, 0, search, this.joinFields);
    }
    return of(null);
  }

  openNewStockForm() {
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
