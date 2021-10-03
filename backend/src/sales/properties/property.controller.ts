import {Controller, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {PropertyService} from './property.service';
import {Crud} from '@nestjsx/crud';
import {Property} from './property';

@Crud({
  model: {
    type: Property
  },
  query: {
    join: {
      values: {eager: true}
    }
  }
})
@Controller('property')
@UseGuards(JwtAuthGuard)
export class PropertyController {

  constructor( public service: PropertyService) {
  }

}
