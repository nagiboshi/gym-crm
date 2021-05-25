import { Controller } from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {PaymentMethod} from './payment-method';
import {PaymentMethodService} from './payment-method.service';


@Crud({
  model: {
    type: PaymentMethod
  }
})
@Controller('payment-method')
export class PaymentMethodController {

  constructor( public service: PaymentMethodService) {
  }
}
