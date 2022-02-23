import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PurchaseVoucherItem} from '@models/purchase-voucher';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PropertyValue} from '@models/property';

export interface PurchaseVoucherFormData  {
  id: number;
  productId: number;
  qty: number;
  details?: Array<PropertyValue>
}
@Component({
  selector: 'voucher-item',
  templateUrl: './voucher-item.component.html',
  styleUrls: ['./voucher-item.component.scss']
})
export class VoucherItemComponent implements OnInit {
  public form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: PurchaseVoucherItem, private fb: FormBuilder) { }

  ngOnInit(): void {
    if( !this.data.productId) {
      throw new Error('Purchase voucher item requires product to be filled. Please join product');
    }

    this.form = this.fb.group({
      id: [this.data.id ],
      productId: [this.data.productId, Validators.required],
      price: [this.data.price, Validators.required],
      qty: [this.data.qty, [Validators.required, Validators.min(1), Validators.max(99999) ]],
      product: [this.data.product],
      details: [this.data.details]
    });
  }

  updateVoucherDetails(updatePropertyValue: PropertyValue) {
    const voucherDetails: Array<PropertyValue> = this.form.value.details;
    const idx = voucherDetails.findIndex( vDetails => vDetails.propertyId == updatePropertyValue.propertyId );
    if( idx == -1 ) {
      voucherDetails.push(updatePropertyValue);
    } else {
      voucherDetails.splice(idx, 1,  updatePropertyValue);
    }
    this.form.patchValue({details: voucherDetails});
  }
}
