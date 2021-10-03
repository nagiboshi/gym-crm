import {Body, Controller, Logger, UploadedFiles, UseGuards} from '@nestjs/common';
import {StockService} from './stock.service';
import {Crud, CrudRequest, Override, ParsedRequest} from '@nestjsx/crud';
import {Stock} from './stock';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {FileUploadingUtils} from '../../interceptors/file-uploading-utils.interceptor';

@Crud({
  model: {
    type: Stock
  },
  query: {
    join: {
      properties: {eager: false},
      'properties.values': {eager: false, alias: 'propertyValues'},
      subcategory: {eager: false}
    },
    alwaysPaginate: true,

  },
  routes: {
    createOneBase: {
      interceptors: [FileUploadingUtils.multipleFileUploader('images[]')],
    }
  }
})
@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  private readonly logger = new Logger(StockController.name);

  constructor(public service: StockService) {
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @Body() body,
    @UploadedFiles() images: Array<any & UploadedImage>) {
    const stock: Stock = new Stock();
    stock.images = images.map(img => img.path);
    return await this.service.createOne(req, stock);
  }


}
