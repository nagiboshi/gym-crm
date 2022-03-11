import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {InventoryService} from '../sales/inventory/inventory.service';
import * as ExcelJS from 'exceljs';
import {Row, Worksheet} from 'exceljs';
import {InventoryItem} from '../sales/inventory/inventory-item';
import {Between, FindManyOptions, In} from 'typeorm';
import {ScheduleMemberService} from '../schedule-member/schedule-member.service';
import * as moment from 'moment';
import {ScheduleMember, ScheduleMemberFields} from '../schedule-member/schedule-member';
import {ClassSchedule, ClassScheduleFields} from '../class-schedule/class-schedule.model';
import {CategoryFields} from '../sales/category/category';
import {ClassModel, ClassModelFields} from '../classes/class-model';
import {MemberFields} from '../member/member';
import {Moment} from 'moment';
import {MembershipPurchaseFields} from '../membership-purchase/membership-purchase';

interface AttendanceFilter {
  attendanceClassIds: Array<number>;
  fromDate: Date;
  toDate: Date;
  startTime: number;
  endTime: number;
  memberIds: Array<number>;
}

@Controller('reports')
export class ReportsController {

  constructor(public inventoryService: InventoryService, private scheduleMemberService: ScheduleMemberService) {
  }


  // "not" | "lessThan" | "lessThanOrEqual" | "moreThan" | "moreThanOrEqual" | "equal" | "between" | "in" | "any" | "isNull" | "ilike" | "like" | "raw";

  @Post('/attendanceReport')
  async attendanceReport(@Req() req, @Res() res) {
    const filter: AttendanceFilter = req.body;

    filter.fromDate = new Date(filter.fromDate);
    filter.toDate = new Date(filter.toDate);

    if (filter.startTime == null) {
      const startDayMoment = moment(filter.fromDate).startOf('day').toDate();
      filter.fromDate = startDayMoment;
    } else {
      const time = filter.fromDate.getTime() + filter.startTime;
      filter.fromDate = new Date(time);
    }

    if (filter.endTime == null) {
      filter.toDate = moment(filter.toDate).endOf('day').toDate();
    } else {
      const time = filter.toDate.getTime() + filter.endTime;
      filter.toDate = new Date(time);
    }
    const RELATION_MEMBER = ScheduleMemberFields.member;
    const RELATION_SCHEDULE = ScheduleMemberFields.schedule;
    const RELATION_SCHEDULE_CLASS = `${ScheduleMemberFields.schedule}.${ClassScheduleFields.scheduleClass}`;
    const RELATION_CLASS_CATEGORY = `${ScheduleMemberFields.schedule}.${ClassScheduleFields.scheduleClass}.${ClassModelFields.category}`;
    const RELATION_ACTIVE_MEMBERSHIP = `${ScheduleMemberFields.member}.${MemberFields.activeMembership}`;
    const RELATION_MEMBERSHIP_INFO = `${ScheduleMemberFields.member}.${MemberFields.activeMembership}.${MembershipPurchaseFields.membership}`;
    const queryFilter: FindManyOptions = {relations: [RELATION_MEMBER, RELATION_SCHEDULE, RELATION_SCHEDULE_CLASS, RELATION_CLASS_CATEGORY,RELATION_ACTIVE_MEMBERSHIP, RELATION_MEMBERSHIP_INFO ],

      where: {}};
    if (filter.fromDate && filter.toDate) {
      queryFilter.where[ScheduleMemberFields.scheduleDate] = Between(filter.fromDate, filter.toDate);
    }


    if (filter.memberIds != null && filter.memberIds.length > 0) {
      queryFilter.where[ScheduleMemberFields.memberId] = In(filter.memberIds);
    }

    if (filter.attendanceClassIds != null && filter.attendanceClassIds.length > 0) {
      queryFilter.where[ScheduleMemberFields.schedule] = {'scheduleClass': {'id': In(filter.attendanceClassIds)}};
    }

    const scheduleMembers: ScheduleMember[] = await this.scheduleMemberService.find(queryFilter);
    console.log(scheduleMembers);
    const wb = new ExcelJS.Workbook();
    const worksheet: Worksheet = wb.addWorksheet('Attendance Report');
    worksheet.columns = [
      {header: 'Date', width: 10, key: 'date'},
      {header: 'Day', width: 10, key: 'day'},
      {header: 'Time', width: 10, key: 'time'},
      {header: 'Client ID', width: 10, key: 'clientId'},
      {header: 'Client', width: 20, key: 'client'},
      // TODO:: Think about to change class to any other option
      {header: 'Class type', width: 10, key: 'classType'},
      {header: 'Class', width: 20 , key: 'clazz'},
      {header: 'Membership', key: 'membership'},
      {header: 'Expiry Date', key: 'expiry'},
      {header: 'Location', key: 'location'}
    ];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        row.height = 22;
        row.fill = {type: 'pattern', fgColor: {argb: '0075a9'}, pattern: 'solid'};
        row.font = {bold: true, color: {argb: 'ffffff'}, size: 15};
      }
    });


    for (let idx = 0; idx < scheduleMembers.length; idx++) {
      const scheduleDateMoment = moment(scheduleMembers[idx].scheduleDate);
      const activeMembership = scheduleMembers[idx].member.activeMembership;
      let membershipExpirationDate;
      if( activeMembership ) {
        let membershipExpirationDate: Moment = moment(activeMembership.saleDate);
        const expirationType = activeMembership.membership.expirationType;

        if (expirationType == 'day') {
          membershipExpirationDate.add(activeMembership.membership.expirationLength, 'day');
        } else if (expirationType == 'month') {
          membershipExpirationDate.add(activeMembership.membership.expirationLength, 'month');
        } else {
          membershipExpirationDate.add(activeMembership.membership.expirationLength, 'year');
        }
      }

      worksheet.addRow({
        'date': scheduleDateMoment.format('L'),
        'day': scheduleDateMoment.format('dddd'),
        'time': scheduleDateMoment.format('LT'),
        'clientId': scheduleMembers[idx].memberId,
        'client': `${scheduleMembers[idx].member.firstName} ${scheduleMembers[idx].member.lastName}`,
        'classType': scheduleMembers[idx].schedule.scheduleClass.category.name,
        'clazz': scheduleMembers[idx].schedule.scheduleClass.name,
        'membership': activeMembership?.membership.name ?? '',
        'expiry': membershipExpirationDate ? membershipExpirationDate.format('L'): ''
      }
      );
    }

    const buffer = await wb.xlsx.writeBuffer({filename: 'stock-valuation'});
    res.header('Content-Disposition', 'attachment; filename="stock-valuation.xlsx"');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }

  @Get('/stockValuation')
  async stockValuation(@Res() res) {
    const wb = new ExcelJS.Workbook();
    const worksheet: Worksheet = wb.addWorksheet('Stock Valuation');
    worksheet.columns = [
      {header: 'Id', width: 10, key: 'id'},
      {header: 'Name', width: 40, key: 'name'},
      {header: 'Color', key: 'color'},
      {header: 'Size', key: 'size'},
      {header: 'Qty', key: 'qty'},
      {header: 'Price', key: 'price'},
      {header: 'Total', width: 20, key: 'total'}
    ];

    const inventory: Array<InventoryItem> = await this.inventoryService.repo.find();
    for (let idx = 0; idx < inventory.length; idx++) {
      worksheet.addRow({
        'id': inventory[idx].id,
        'name': inventory[idx].product.name,
        'qty': inventory[idx].qty,
        'color': inventory[idx].details[1].value,
        'size': inventory[idx].details[0].value,
        'price': inventory[idx].price,
        'total': 'Total'
      });
    }


    let firstRow: Row = worksheet.getRow(2);
    let lastRow: Row = worksheet.lastRow;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        row.height = 22;
        row.fill = {type: 'pattern', fgColor: {argb: '0075a9'}, pattern: 'solid'};
        row.font = {bold: true, color: {argb: 'ffffff'}, size: 15};
      }

      if (rowNumber > 1) {
        row.getCell('total').value = {date1904: false, formula: `${row.getCell('qty').address}*${row.getCell('price').address}`};
      }


    });
    worksheet.getRow(2);
    worksheet.addRow({'id': '', 'name': '', 'qty': '', 'price': '', 'total': ''});
    const totalRow = worksheet.addRow({
      'id': '',
      'name': '',
      'qty': '',
      'price': 'TOTAL',
      'total': {date1904: false, formula: `SUM(${firstRow.getCell('total').address}:${lastRow.getCell('total').address})`}
    });
    totalRow.getCell('price').font = {bold: true, color: {argb: '3fa53e'}, size: 15};
    totalRow.getCell('total').font = {bold: true, color: {argb: '3fa53e'}, size: 15};

    const buffer = await wb.xlsx.writeBuffer({filename: 'stock-valuation'});
    res.header('Content-Disposition', 'attachment; filename="stock-valuation.xlsx"');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }
}
