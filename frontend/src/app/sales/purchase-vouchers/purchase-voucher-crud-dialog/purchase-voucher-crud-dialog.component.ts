import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PurchaseVoucher, PurchaseVoucherItem} from '@models/purchase-voucher';
import {Supplier} from '@models/supplier';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Product} from '@models/product';
import {ProductService} from '../../product/product.service';
import {PurchaseVouchersService} from '../purchase-vouchers.service';
import {HelpersService} from '@shared/helpers.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {Moment} from 'moment';
import {VoucherItemComponent} from '../voucher-item/voucher-item.component';
import {QueryJoin} from '@nestjsx/crud-request';

@Component({
  selector: 'purchase-voucher-crud-dialog',
  templateUrl: './purchase-voucher-crud-dialog.component.html',
  styleUrls: ['./purchase-voucher-crud-dialog.component.scss']
})
export class PurchaseVoucherCrudDialogComponent implements OnInit {
  dataSource: MatTableDataSource<PurchaseVoucherItem>;
  columns = ['name', 'qty', 'price', 'edit', 'delete'];
  form: FormGroup;
  minDateTo: any;
  voucherItemsToRemove: PurchaseVoucherItem[];
  findProductJoinFields: QueryJoin[] = [{field: 'properties'}, {field: 'properties.values'}];

  constructor(@Inject(MAT_DIALOG_DATA) public purchaseVoucher: PurchaseVoucher,
              private purchaseVouchersService: PurchaseVouchersService,
              private dialogRef: MatDialogRef<PurchaseVoucherCrudDialogComponent>,
              private productService: ProductService,
              private helpersService: HelpersService,
              private dialog: MatDialog,
              private fb: FormBuilder) {
  }


  ngOnInit(): void {
    const purchaseVoucherItems = [...this.purchaseVoucher.items];

    this.dataSource = new MatTableDataSource<PurchaseVoucherItem>(purchaseVoucherItems);
    this.minDateTo = this.purchaseVoucher.from;
    this.form = this.fb.group({
      id: [this.purchaseVoucher.id],
      from: [this.purchaseVoucher.from, Validators.required],
      to: [this.purchaseVoucher.to],
      items: [this.dataSource.data, Validators.required],
      supplier: [this.purchaseVoucher.supplier, Validators.required],
    });
  }

  addNewItem(product: Product) {
    const voucherItem: PurchaseVoucherItem = {
      id: 0,
      productId: product.id,
      product,
      price: 0,
      qty: 1,
      details: [],
      purchaseVoucher: this.form.value
    };
    this.dialog.open(VoucherItemComponent, {data: voucherItem}).afterClosed().subscribe(async (newVoucherItem: PurchaseVoucherItem) => {
      if (newVoucherItem) {
        this.dataSource.data = [newVoucherItem, ...this.dataSource.data];
        this.form.patchValue({items: this.dataSource.data});
      }
    });
  }


  supplierSelected(supplier: Supplier) {
    this.form.patchValue({supplier});
  }

  removeSupplier() {
    this.form.patchValue({supplier: null});
  }

  updateFromDateField(changeDateEvent: MatDatepickerInputEvent<unknown, unknown | null>) {
    const jsonFromDate = (changeDateEvent.value as Moment).toJSON();
    this.form.patchValue({from: jsonFromDate});
    this.minDateTo = jsonFromDate;
  }

  updateToDateField(changeDateEvent: MatDatepickerInputEvent<unknown, unknown | null>) {
    this.form.patchValue({to: (changeDateEvent.value as Moment).toJSON()});
  }

  editVoucherItem(idx: number) {
    const voucherItem = this.dataSource.data[idx];
    this.dialog.open(VoucherItemComponent, {data: voucherItem}).afterClosed().subscribe(async (editedVoucherItem: PurchaseVoucherItem) => {
      if( editedVoucherItem ) {
        let data = this.dataSource.data;
        data.splice(idx, 1, editedVoucherItem );
        this.dataSource.data = [...data];
        this.form.patchValue({items: this.dataSource.data});
      }
    });
  }

  deletePurchaseVoucherItem(idx: number) {

        const voucherItems = this.dataSource.data;
        const removedVoucherItems = voucherItems.splice(idx, 1);
        this.dataSource.data = [...voucherItems];
        this.form.patchValue({items: this.dataSource.data});
    // if( this.purchaseVoucher.id !=0 ) {
    //   this.voucherItemsToRemove.push(...removedVoucherItems);
    // }
  }
}
