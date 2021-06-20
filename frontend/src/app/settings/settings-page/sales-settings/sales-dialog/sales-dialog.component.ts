import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ProductCategory} from '@models/product-category';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {Product} from '@models/product';

@Component({
  selector: 'app-sales-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.scss']
})
export class SalesDialogComponent implements OnInit {
  formGroup: FormGroup;
  productsArray: FormArray;

  constructor(@Inject(MAT_DIALOG_DATA) public productCategory: ProductCategory,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<SalesDialogComponent>,
              private dialog: MatDialog) {

    this.productsArray = new FormArray([]);

    productCategory.products.forEach((item) => {
      this.productsArray.push(
        this.newProductFormGroup(item)
      );
    });

    this.formGroup = fb.group({
      id: this.productCategory.id,
      type: [this.productCategory.type, Validators.required],
      name: [this.productCategory.name, Validators.required],
      products: this.productsArray
    });
  }


  newProductFormGroup(item?: Product) {
    return this.fb.group({
      id: [item?.id ?? 0],
      name: [item?.name, [Validators.required]],
      isShared: [item?.isShared],
      numberOfParticipants  : [item?.numberOfParticipants ?? 1, [Validators.required]],
      expirationType: [item?.expirationType, Validators.required],
      expirationLength: [item?.expirationLength, Validators.required],
      type: [0, Validators.required]
    })
  }

  submit() {
    this.dialogRef.close(this.formGroup.value);
  }

  ngOnInit(): void {
  }

  showDeletePrompt(index: number, formValue: any) {
      this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove package item ${formValue.name} ?` }).afterClosed().subscribe((doRemove) => {
        if( doRemove ) {
            this.productsArray.removeAt(index);
            this.formGroup.markAsDirty();
        }
      })
  }

  addProduct() {
    this.productsArray.push(this.newProductFormGroup())
  }
}
