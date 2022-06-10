import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Property} from './properties/property';
import {Product} from './product/product';
import {PropertyService} from './properties/property.service';
import {ProductService} from './product/product.service';
import {PropertyController} from './properties/property.controller';
import {ProductController} from './product/product.controller';
import {Category} from './category/category';
import {Subcategory} from './category/subcategory';
import {CategoryService} from './category/category.service';
import {CategoryController} from './category/category.controller';
import {PropertyValueService} from './properties/property-value/property-value.service';
import {PropertyValue} from './properties/property-value/property-value';
import {SupplierController} from './supplier/supplier.controller';
import {SupplierService} from './supplier/supplier.service';
import {Supplier} from './supplier/supplier';
import {SubcategoryController} from './category/subcategory.controller';
import {SubcategoryService} from './category/subcategory.service';
import {PurchaseVoucher} from './purchase-vouchers/purchase-voucher';
import {PurchaseVoucherService} from './purchase-vouchers/purchase-voucher.service';
import {PurchaseVoucherController} from './purchase-vouchers/purchase-voucher.controller';
import {InventoryItem} from './inventory/inventory-item';
import {InventoryService} from './inventory/inventory.service';
import {InventoryController} from './inventory/inventory.controller';
import {StockPurchaseService} from './stock-purchase/stock-purchase.service';
import {StockPurchase} from './stock-purchase/stock-purchase';
import {StockPurchaseController} from './stock-purchase/stock-purchase.controller';
import {PurchaseVoucherItem} from './purchase-vouchers/purchase-voucher-item';
import {PurchaseVoucherItemService} from './purchase-vouchers/purchase-voucher-item.service';
import {RequestService} from '../shared/request.service';
import {PaymentsModule} from '../payments/payments.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, PurchaseVoucherItem, Property, Supplier, StockPurchase, PurchaseVoucher, PropertyValue, Category, Subcategory, Product]),PaymentsModule],
  providers: [InventoryService, RequestService, PurchaseVoucherItemService, PropertyValueService, StockPurchaseService, PurchaseVoucherService, SubcategoryService, PropertyService, ProductService, CategoryService, SupplierService],
  controllers: [InventoryController, PropertyController, PurchaseVoucherController, StockPurchaseController, SubcategoryController, CategoryController, ProductController, SupplierController],
  exports: [InventoryService]
})
export class SalesModule {
}
