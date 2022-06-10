import {Controller, HttpException, HttpStatus, Logger, UseGuards} from '@nestjs/common';
import {Crud, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {Supplier} from './supplier';
import {SupplierService} from './supplier.service';
import {CrudRequest} from '@nestjsx/crud/lib/interfaces';
import {PropertyService} from '../properties/property.service';
import {Property} from '../properties/property';
import {DbErrorCodes} from '../../shared/misc.const';
import {PropertyValueService} from '../properties/property-value/property-value.service';


@Crud({
  model: {type: Supplier},
  query: {
    join: {
      properties: {eager: false},
      'properties.values': {eager: false, alias: 'propertyValues'}
    }
  }
})
@Controller('supplier')
@UseGuards(JwtAuthGuard)
export class SupplierController {
  private readonly logger = new Logger(SupplierController.name);
  constructor(private service: SupplierService, private propertyService: PropertyService, private propertyValueService: PropertyValueService ) {
  }


  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Supplier
  ) {
    try {
      const supplierProperties: Property[] = dto.properties;
      dto.properties = null;
      const savedSupplier = await this.service.createOne(req, dto);
      if( supplierProperties ) {
        supplierProperties.forEach(s => s.supplierId = savedSupplier.id);
        savedSupplier.properties = await this.propertyService.saveBatch(supplierProperties);
      }
      return savedSupplier;
    } catch (e) {
      if( e.code == DbErrorCodes.ENTITY_DUPLICATION_ERROR) {
        throw new HttpException(`Supplier with name ${dto.name} already exist`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
