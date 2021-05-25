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
import {PackageModule} from './package/package.module';
import {Package} from './package/package';
import {PaymentMethodModule} from './payment-method/payment-method.module';
import {PaymentMethod} from './payment-method/payment-method';
import {PurchaseItemModule} from './purchase-item/purchase-item.module';
import {PurchaseFreeze} from './purchase-item/purchase-freeze';
import {PurchaseItem} from './purchase-item/purchase-item';
import {PackageItem} from './package/package-item';

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
      keepConnectionAlive: true,
      entities: [
        Member, User, Branch, ClassCategory, ClassModel, PackageItem, Package, PaymentMethod, PurchaseItem, PurchaseFreeze
      ],
      synchronize: true,
    })
  }), MemberModule, UserModule, AuthModule, BranchModule, ClassesModule, ClassCategoryModule, PackageModule, PaymentMethodModule, PurchaseItemModule],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {
}
