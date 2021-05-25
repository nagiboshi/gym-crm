import { Controller } from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {ClassModel} from './class-model';
import {ClassesService} from './classes.service';

@Crud({
  model: {
    type: ClassModel
  }
})
@Controller('classes')
export class ClassesController {

  constructor(public service: ClassesService) {
  }
}
