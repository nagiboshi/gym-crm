import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {Payment} from './payment';
import {PaymentService} from './payment.service';


@Crud({
  model: {
    type: Payment
  }
})
@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {

  constructor( public service: PaymentService) {
  }
}
