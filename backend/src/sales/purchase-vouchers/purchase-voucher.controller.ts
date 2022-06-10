import {Body, Controller, Logger, Request, UploadedFiles, UseGuards} from '@nestjs/common';
import {PurchaseVoucherService} from './purchase-voucher.service';
import {Crud, CrudRequest, Override, ParsedRequest} from '@nestjsx/crud';
import {PurchaseVoucher} from './purchase-voucher';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {FileUploadingUtils} from '../../interceptors/file-uploading-utils.interceptor';
import * as dot from 'dot-object';
import {plainToClass} from 'class-transformer';
import {PurchaseVoucherSubmit} from './purchase-voucher.submit';
import {PropertyService} from '../properties/property.service';
import {PropertyValueService} from '../properties/property-value/property-value.service';
import {ProductService} from '../product/product.service';
import {InventoryService} from '../inventory/inventory.service';
import {PurchaseVoucherItemService} from './purchase-voucher-item.service';
import {InventoryItem} from '../inventory/inventory-item';

@Crud({
  model: {
    type: PurchaseVoucher
  },
  query: {
    join: {
      supplier: {eager: true},
      items: {eager: false},
      'items.details': {eager: false, alias: 'itemDetails'},
      'items.product': {eager: false, alias: 'itemProduct'}
    },
  },
  routes: {
    createOneBase: {
      interceptors: [FileUploadingUtils.multipleFileUploader('productImages[]')],
    }
  }
})
@Controller('purchase-voucher')
@UseGuards(JwtAuthGuard)
export class PurchaseVoucherController {
  constructor(public service: PurchaseVoucherService,
              public productService: ProductService,
              public propertyService: PropertyService,
              public voucherItemService: PurchaseVoucherItemService,
              public propertyValueService: PropertyValueService,
              public inventoryService: InventoryService) {
  }

  @Override()
  async getMany(@Request() request: Request & {user: any},
                @ParsedRequest() req: CrudRequest) {
    const userBranchId = request.user.selectedBranch.id;
    req.parsed.search.$and.push({branchId: {$eq: userBranchId}});
    return this.service.getMany(req);
  }

  @Override()
  async createOne(
    @Request() request: Request & {user: any},
    @ParsedRequest() req: CrudRequest,
    @Body() body,
    @UploadedFiles() productImages: Array<any & UploadedImage>) {
    const purchaseVoucherPlainObj: object = dot.object(body);
    const purchaseVoucherSubmit = plainToClass(PurchaseVoucherSubmit, purchaseVoucherPlainObj, {enableImplicitConversion: true});
    let purchaseVoucher: PurchaseVoucher = this.service.valueOf(purchaseVoucherSubmit);
    purchaseVoucher.branchId = request.user.selectedBranch.id;
    purchaseVoucher = await this.service.repo.save(purchaseVoucher);
    purchaseVoucher.items.forEach( item => item.purchaseVoucherId = purchaseVoucher.id);
    purchaseVoucher.items = await this.voucherItemService.repo.save(purchaseVoucher.items);
    const inventoryList = purchaseVoucher.items.map( pVoucher => new InventoryItem(pVoucher, purchaseVoucher.branchId));
    await this.inventoryService.repo.save(inventoryList);
    return purchaseVoucher;
  }


}
