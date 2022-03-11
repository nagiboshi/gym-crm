import {Controller, UploadedFile, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {ClassScheduleService} from './class-schedule.service';
import {ClassSchedule} from './class-schedule.model';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: ClassSchedule
  },
  query: {
    join: {
      signedMembers: {
        eager: false,
      }
    }
  }}
)
@Controller('class-schedule')
@UseGuards(JwtAuthGuard)
export class ClassScheduleController {

  constructor(private service: ClassScheduleService) {
  }


}
