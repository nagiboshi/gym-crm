import {Controller, Logger, Request, UploadedFiles, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedRequest} from '@nestjsx/crud';
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

  constructor(public service: InventoryService) {
  }

  @Override()
  async getMany(@Request() request: Request & {user: any},
                @ParsedRequest() req: CrudRequest) {
    const userBranchId = request.user.selectedBranch.id;
    req.parsed.search.$and.push({branchId: {$eq: userBranchId}});
    return this.service.getMany(req);
  }



}
