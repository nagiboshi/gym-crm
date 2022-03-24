import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {PaymentMethod} from './payment-method';
import {PaymentMethodService} from './payment-method.service';


@Crud({
  model: {
    type: PaymentMethod
  }
})
@Controller('payment-method')
@UseGuards(JwtAuthGuard)
export class PaymentMethodController {

  constructor( public service: PaymentMethodService) {
  }
}
