import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {Supplier} from './supplier';
import {SupplierService} from './supplier.service';


@Crud({
  model: {type: Supplier}
})
@Controller('supplier')
@UseGuards(JwtAuthGuard)
export class SupplierController {
  constructor(private service: SupplierService) {
  }
}
