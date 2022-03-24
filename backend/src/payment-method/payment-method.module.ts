import {Module} from '@nestjs/common';
import {PaymentMethodService} from './payment-method.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PaymentMethod} from './payment-method';
import {PaymentMethodController} from './payment-method.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  providers: [PaymentMethodService],
  controllers: [PaymentMethodController],
  exports: [PaymentMethodService]
})
export class PaymentMethodModule {
}
