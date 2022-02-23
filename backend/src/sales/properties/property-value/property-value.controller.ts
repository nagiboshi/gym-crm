import {Controller, UseGuards} from '@nestjs/common';
import {PropertyValueService} from './property-value.service';
import {Crud} from '@nestjsx/crud';
import {PropertyValue} from './property-value';
import {JwtAuthGuard} from '../../../auth/jwt-auth.guard';
import {InjectRepository} from '@nestjs/typeorm';

@Crud({
  model: {
    type: PropertyValue
  }
})
@Controller('property-value')
@UseGuards(JwtAuthGuard)
export class PropertyValueController {

  constructor( @InjectRepository(PropertyValue) public service: PropertyValueService) {
  }

}
