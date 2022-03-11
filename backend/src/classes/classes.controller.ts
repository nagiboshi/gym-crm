import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {ClassModel} from './class-model';
import {ClassesService} from './classes.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: ClassModel
  },

})
@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {

  constructor(public service: ClassesService) {
  }
}
