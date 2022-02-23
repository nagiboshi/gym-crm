import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {Product} from '@models/product';
import {ProductService} from '../../product/product.service';
import {Property} from '@models/property';


@Component({
  selector: 'product-crud-dialog',
  templateUrl: './product-crud-dialog.component.html',
  styleUrls: ['./product-crud-dialog.component.scss']
})
export class ProductCrudDialogComponent {
  @ViewChild('productImageChoose')
  productImageChoose: ElementRef;
  productImageSources = [];
  formGroup: FormGroup;
  productProperties: Property[];

  constructor(@Inject(MAT_DIALOG_DATA) public product: Product, private domSanitizer: DomSanitizer, private productService: ProductService, private fb: FormBuilder) {
  }


  ngOnInit(): void {
    if (!this.product) {
      this.product = {
        id: 0,
        name: '',
        properties: [],
        images: [],
        subcategory: null,
        subcategoryId: null,
      };
      this.productProperties = [];
    }

    this.formGroup = this.fb.group({
      id: [this.product.id],
      name: ['', Validators.required],
      properties: this.productProperties,
      images: [],
    });
  }

  handleProductImage(e: Event) {
    const imgs = (<any> e.target).files;
    this.handleProductImagesChange(imgs);
  }

  handleProductImagesChange(newImageList: FileList) {
    if (newImageList) {

      // const imageList = this.formGroup.value.images;
      const imageListArr = Array.from(newImageList);
      const dt = new DataTransfer();
      for (const file of imageListArr) {
        dt.items.add(file as File);
      }

      if( this.formGroup.value.images ) {
        for (const file of Array.from(this.formGroup.value.images)) {
          dt.items.add(file as File);
        }
      }

      this.formGroup.patchValue({images: Array.from(dt.files)});

      for (let imageObj of Object.values(newImageList)) {
        this.productImageSources.push(this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(imageObj)) as string);
      }
    }
  }


  removeImage(imgIndex: number) {
    this.productImageSources.splice(imgIndex, 1);
    const imageList = this.formGroup.value.images;
    const imageListArr = Array.from(imageList);
    imageListArr.splice(imgIndex, 1);
    const dt = new DataTransfer();
    for (const file of imageListArr) {
      dt.items.add(file as File);
    }
    this.formGroup.patchValue({images: Array.from(dt.files)});
    this.productImageChoose.nativeElement.files = dt.files;
  }

  updateProductProperties(newProperties: Property[]) {
    this.productProperties = newProperties;
    this.formGroup.patchValue({'properties': newProperties});
  }
}
