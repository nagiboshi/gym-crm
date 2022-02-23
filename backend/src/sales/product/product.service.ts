import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Product} from './product';
import {Repository} from 'typeorm';
import {PropertyService} from '../properties/property.service';
import {PurchaseVoucherSubmitItem} from '../purchase-vouchers/purchase-voucher.submit';
import {Supplier} from '../supplier/supplier';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) public repo: Repository<Product>, public propertyService: PropertyService) {
    super(repo);
  }


  productImageUid(uploadedImage: UploadedImage) {
      return uploadedImage.originalname + uploadedImage.mimetype;
  }


  valueOf(purchaseVoucherProduct: PurchaseVoucherSubmitItem, supplier: Supplier, imageUidToImageMapping: object, images?: Array<UploadedImage>): Product {
    const product = new Product();
    product.id  = purchaseVoucherProduct.id;
    product.name = purchaseVoucherProduct.name;
    product.images = [];
    // product.qty = purchaseVoucherProduct.qty;
    // product.price = purchaseVoucherProduct.price;
    // product.size = purchaseVoucherProduct.size;
    // product.color = purchaseVoucherProduct.color;
   //  product.properties = purchaseVoucherProduct.properties;
   //  debugger;
    const productImages = imageUidToImageMapping[purchaseVoucherProduct.uid];
    for (const productImage of images ) {
      for( const productImageMapping of productImages ) {
        const imageUid = this.productImageUid(productImage);
        if(productImageMapping == imageUid ) {
          product.images.push(productImage.path);
        }
      }

    }
    return product;
  }
}
