import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {PaymentMethod} from './payment-method';
import {PaymentMethodService} from './payment-method.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';


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
