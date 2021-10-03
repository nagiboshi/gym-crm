import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as Joi from 'joi';
import {MemberModule} from './member/member.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Member} from './member/member';
import {UserModule} from './user/user.module';
import {User} from './user/user';
import {AuthModule} from './auth/auth.module';
import {BranchModule} from './branch/branch.module';
import {Branch} from './branch/branch';
import {ClassesModule} from './classes/classes.module';
import {ClassCategoryModule} from './class-category/class-category.module';
import {ClassCategory} from './class-category/class-category';
import {ClassModel} from './classes/class-model';
import {MembershipGroupModule} from './membership-group/membership-group.module';
import {MembershipGroup} from './membership-group/membership-group';
import {PaymentMethodModule} from './payment-method/payment-method.module';
import {PaymentMethod} from './payment-method/payment-method';
import {MembershipPurchaseModule} from './membership-purchase/membership-purchase.module';
import {MembershipFreeze} from './membership-purchase/membership-freeze';
import {MembershipPurchase} from './membership-purchase/membership-purchase';
import {Membership} from './membership-group/membership';
import {ClassScheduleModule} from './class-schedule/class-schedule.module';
import {ClassSchedule} from './class-schedule/class-schedule.model';
import {ScheduleMember} from './schedule-member/schedule-member';
import {SalesModule} from './sales/sales.module';
import {Stock} from './sales/stock/stock';
import {Property} from './sales/properties/property';
import { StockPurchaseModule } from './stock-purchase/stock-purchase.module';
import {StockPurchase} from './stock-purchase/stock-purchase';
import {Subcategory} from './sales/category/subcategory';
import {Category} from './sales/category/category';
import {PropertyValue} from './sales/properties/property-value/property-value';
import {Supplier} from './sales/supplier/supplier';
import {Product} from './sales/product/product';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
    })
  },), TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: configService.get('POSTGRES_PORT'),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
      schema: 'public',
      logging: true,
      keepConnectionAlive: true,
      entities: [
        Member,
        User,
        Branch,
        ClassCategory,
        Product,
        ScheduleMember,
        ClassModel,
        Membership,
        ClassSchedule,
        MembershipGroup,
        PaymentMethod,
        MembershipPurchase,
        MembershipFreeze,
        StockPurchase,
        Stock,
        PropertyValue,
        Supplier,
        Property,
        Category,
        Subcategory
      ],
      synchronize: true,
    })
  }),
    MemberModule,
    UserModule,
    AuthModule,
    BranchModule,
    ClassesModule,
    ClassCategoryModule,
    MembershipGroupModule,
    PaymentMethodModule,
    MembershipPurchaseModule,
    SalesModule,
    ClassScheduleModule,
    StockPurchaseModule],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {
}
