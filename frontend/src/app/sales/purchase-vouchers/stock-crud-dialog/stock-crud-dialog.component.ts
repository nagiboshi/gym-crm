import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Stock} from '@models/stock';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips/chip-input';
import {Property} from '@models/property';
import {StockService} from '../../stock/stock.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Product} from '@models/product';
import {ProductService} from '../../product/product.service';

@Component({
  selector: 'stock-crud-dialog',
  templateUrl: './stock-crud-dialog.component.html',
  styleUrls: ['./stock-crud-dialog.component.scss']
})
export class StockCrudDialogComponent {
  @ViewChild('productImageChoose')
  productImageChoose: ElementRef;
  @ViewChild('productPreview')
  productPreviewElRef: ElementRef;
  productImageSources=[];
  formGroup: FormGroup;
  stockProperties: FormArray;
  stockDetails: FormArray;
  selectedProduct: Product;
  constructor(@Inject(MAT_DIALOG_DATA) public stock: Stock, private domSanitizer: DomSanitizer, private productService: ProductService, private stockService: StockService, private fb: FormBuilder) {
  }

  _newStockPropertyFormGroup(stockProperty?: Property) {
    if (!stockProperty) {
      stockProperty = {id: 0, name: '', values: []};
    }

    const propertyValues = new FormArray([]);
    stockProperty.values.forEach(option => {
      propertyValues.push(this.fb.group({
        id: [option.id],
        value: [option.value, Validators.required],
      }));
    });
    return this.fb.group({
      id: [stockProperty.id],
      name: [stockProperty.name, Validators.required],
      values: propertyValues
    });
  }




  ngOnInit(): void {
    this.stockProperties = new FormArray([]);

    // if (this.stock.id != 0) {
    //   this.stockService.getStockWithProperties(this.stock.id).toPromise().then((stockWithProperties)=>{
    //     // stockWithProperties.properties.forEach(property => {
    //     //   this.addStockProperty(property);
    //     // });
    //   });
    // } else {
    //   // this.stock.details.forEach( property => this.addStockProperty(property));
    // }


    if( !this.stock ) {
      this.stock = {id: 0, qty: 0, details: [], images: [], price:0, product: null};
    }

    this.formGroup = this.fb.group({
      id: [this.stock.id],
      qty: [this.stock.qty ?? 0, [Validators.min(0)]],
      price: [this.stock.price, [Validators.min(0)]],
      properties: this.stockProperties,
      details: [],
      images: []
    });
  }

  addStockProperty(stockProperty?: Property) {
    this.stockProperties.push(this._newStockPropertyFormGroup(stockProperty));
  }

  addPropertyValue(stockPropertiesArray: FormArray, $event: MatChipInputEvent, inputFieldElRef: HTMLInputElement) {
    stockPropertiesArray.push(this.fb.group({
      id: [0, null],
      value: [$event.value, Validators.required],
    }));
    inputFieldElRef.value = '';
  }

  removeFieldValue(stockPropertyValuesFormArray: FormArray, index: number) {
    stockPropertyValuesFormArray.removeAt(index);
  }


  removeField(index: number) {
    this.stockProperties.removeAt(index);
  }

  handleProductImage(e: Event ) {
    const imgs = (<any>e.target).files;
    this.handleProductImagesChange(imgs);
  }

  handleProductImagesChange(imageList: FileList) {
    if( imageList ) {
      this.formGroup.patchValue({images: imageList});
      for (let imageObj of Object.values(imageList)) {
        this.productImageSources.push(this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(imageObj)) as string);
      }
    }
  }

  async productSelected( product: Product ) {
    const fullProduct = await this.productService.getFullEntity(product.id);
    this.selectedProduct = fullProduct;
  }

  removeImage(imgIndex: number) {
    this.productImageSources.splice(imgIndex, 1);
    const imageList = this.formGroup.value.images;
    const imageListArr = Array.from(imageList)
    imageListArr.splice(imgIndex, 1);
    const dt = new DataTransfer();
    for( const file of imageListArr ) {
      dt.items.add(file as File);
    }
    this.productImageChoose.nativeElement.files = dt.files;
    this.formGroup.patchValue({images: dt.files});
  }
}
