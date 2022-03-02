import { Controller, Logger, UploadedFiles, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {Product} from '../product/product';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {FileUploadingUtils} from '../../interceptors/file-uploading-utils.interceptor';
import {InventoryItem} from './inventory-item';
import {InventoryService} from './inventory.service';

@Crud({
  model: {
    type: InventoryItem
  },
  query: {
    join: {
      product: {eager: true},
      'product.properties': {eager: true, alias: 'productProperties'},
      details: {eager: true}
    }
  }
})
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(public service: InventoryService) {
  }



}
