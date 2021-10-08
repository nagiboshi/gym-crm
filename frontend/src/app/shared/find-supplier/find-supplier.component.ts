import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {fromEvent, Observable, of} from 'rxjs';
import {concatMap, debounceTime, distinctUntilChanged, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {Supplier} from '@models/supplier';
import {Router} from '@angular/router';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {isEmpty} from 'lodash';
import {SupplierService} from '../../sales/suppliers/supplier.service';
import {SuppliersCrudComponent} from '../../sales/suppliers/suppliers-crud/suppliers-crud.component';
@Component({
  selector: 'find-supplier',
  templateUrl: './find-supplier.component.html',
  styleUrls: ['./find-supplier.component.scss']
})
export class FindSupplierComponent implements OnInit, AfterViewInit {
  @ViewChild('searchField') searchInput: ElementRef;
  @Input()
  labelColor = '#FFF';
  @Input()
  placeholder;
  @Input()
  selectedSupplier: Supplier;
  @Input()
  clearAfterSelection = false;
  @Output()
  supplierSelected: EventEmitter<Supplier> = new EventEmitter<Supplier>();
  suppliers$: Observable<Supplier[]>;
  searchFormControl: FormControl;
  showNewSupplierOption = false;

  constructor(public dialog: MatDialog, private supplierService: SupplierService, private router: Router) {
  }

  displayFn(supplier: Supplier) {
    return supplier?.name ?? "";

  }

  ngOnInit() {
    this.searchFormControl = new FormControl(this.selectedSupplier ? this.selectedSupplier : null);
  }

  ngAfterViewInit(): void {
    this.suppliers$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        tap(() => { this.showNewSupplierOption = true; }),
        map(event => event.target.value),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(search => this.loadMembers((search)))
      );
  }

  supplierSelect($event: MatAutocompleteSelectedEvent) {
    if (this.searchFormControl.value) {
      this.supplierSelected.emit(this.searchFormControl.value);
      if (this.clearAfterSelection) {
        this.searchFormControl.patchValue(null);
      }
    }
  }

  loadMembers(search): Observable<Supplier[]> {
    if( !isEmpty(search)) {
      return this.supplierService.getSuppliers(10, 0, search).pipe(concatMap(supplierPage => of(supplierPage.data)));
    }
    return of([]);
  }

  openSupplierCreationForm() {
    const newSupplier: Supplier = {id: 0, name: '', properties: []};
    this.searchInput.nativeElement.blur();
    this.showNewSupplierOption = false;
    this.dialog.open(SuppliersCrudComponent, {data: newSupplier})
      .afterClosed()
      .subscribe((newSupplier: Supplier) => {
        if ( newSupplier ) {
          this.supplierService.save(newSupplier).then((savedSupplier) => {
            this.supplierSelected.emit(savedSupplier);
          });
        }
      });
  }
}
