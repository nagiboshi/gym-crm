import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {InventoryService} from '../sales/inventory/inventory.service';
import * as ExcelJS from 'exceljs';
import {Row, Worksheet} from 'exceljs';
import {InventoryItem} from '../sales/inventory/inventory-item';
import {Between, FindManyOptions, In} from 'typeorm';
import {ScheduleMemberService} from '../schedule-member/schedule-member.service';
import * as moment from 'moment';
import {ScheduleMember, ScheduleMemberFields} from '../schedule-member/schedule-member';
import {ClassScheduleFields} from '../class-schedule/class-schedule.model';
import {ClassModelFields} from '../classes/class-model';
import {Member, MemberFields} from '../member/member';
import {Moment} from 'moment';
import {MembershipPurchase, MembershipPurchaseFields} from '../membership-purchase/membership-purchase';
import {MemberService} from '../member/member.service';

interface AttendanceFilter {
  attendanceClassIds: Array<number>;
  fromDate: Date;
  toDate: Date;
  startTime: number;
  endTime: number;
  memberIds: Array<number>;
}

interface DateFilter {
  fromDate: Date;
  toDate: Date;
}

@Controller('reports')
export class ReportsController {

  constructor(public inventoryService: InventoryService, private memberService: MemberService, private scheduleMemberService: ScheduleMemberService) {
  }

  private getMembershipExpirationMoment(membership: MembershipPurchase): Moment {
    let membershipExpirationDate: Moment;
    if( membership ) {
       membershipExpirationDate = moment(membership.startDate);
      const expirationType = membership.membership.expirationType;

      if (expirationType == 'day') {
        membershipExpirationDate.add(membership.membership.expirationLength, 'day');
      } else if (expirationType == 'month') {
        membershipExpirationDate.add(membership.membership.expirationLength, 'month');
      } else {
        membershipExpirationDate.add(membership.membership.expirationLength, 'year');
      }
    }
    return membershipExpirationDate;
  }

  @Post('/membersReport')
  async activeMemberReport(@Req() req, @Res() res) {
    const filter: DateFilter = req.body;
    filter.fromDate = new Date(filter.fromDate);
    filter.toDate = new Date(filter.toDate);

    const RELATION_ACTIVE_MEMBERSHIP = MemberFields.activeMembership;
    const RELATION_MEMBERSHIP = `${MemberFields.activeMembership}.${MembershipPurchaseFields.membership}`;
    const RELATION_MEMBERSHIP_PAYMENTS = `${MemberFields.activeMembership}.${MembershipPurchaseFields.payments}`;
    const RELATION_SOCIAL_ACCOUNTS = MemberFields.socialAccounts;
    const queryFilter: FindManyOptions = {relations: [RELATION_ACTIVE_MEMBERSHIP, RELATION_MEMBERSHIP, RELATION_SOCIAL_ACCOUNTS, RELATION_MEMBERSHIP_PAYMENTS], where: {
      }}
    queryFilter.where[MemberFields.created] = Between(filter.fromDate, filter.toDate)
    const members: Member[] = await this.memberService.find(queryFilter);

    // Membership Reports ( Active member report ) , email address, day of birth, instagram account, . date of sales, emergency contact person, phone number , membership , start date , end date.
    //   In case if we are creating purchase voucher and want to update existing Men

    const wb = new ExcelJS.Workbook();
    const worksheet: Worksheet = wb.addWorksheet('Member Report');
    worksheet.columns = [
      {header: 'Name', width: 20, key: 'name'},
      {header: 'Email', width: 20, key: 'email'},
      {header: 'DOB', width: 10, key: 'dob'},
      {header: 'Phone number', width: 20, key: 'phone'},
      {header: 'Social Accounts', width: 20, key: 'socialAccounts'},
      {header: 'Emergency Contact', width: 20, key: 'emergency'},
      {header: 'Membership', width: 20, key: 'membership'},
      {header: 'Sale Date', width: 20, key: 'saleDate'},
      {header: 'Start Date', width: 20, key: 'startDate'},
      {header: 'Expiry Date', width: 20, key: 'expiryDate'}
    ];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        row.height = 22;
        row.fill = {type: 'pattern', fgColor: {argb: '0075a9'}, pattern: 'solid'};
        row.font = {bold: true, color: {argb: 'ffffff'}, size: 15};
      }
    });

    for (let idx = 0; idx < members.length; idx++) {
      let socialAccounts = '';

      if( members[idx].socialAccounts && members[idx].socialAccounts.length > 0 ) {
        socialAccounts = members[idx].socialAccounts.map( socialAccount => socialAccount.address).reduce( (previousValue, currentValue ) => {
          if( !previousValue ) {
            previousValue = "";
          }
          return previousValue + ", " + currentValue;
        });
      }

      worksheet.addRow({
          'name': `${members[idx].firstName} ${members[idx].lastName}`,
          'email': members[idx].email,
          'dob': members[idx].dob,
          'phone': members[idx].phoneNumber,
          'socialAccounts': socialAccounts,
          'emergencyContact': members[idx].emergencyPhone,
          'membership': members[idx].activeMembership?.membership.name,
          'saleDate': members[idx].activeMembership ? moment(members[idx].activeMembership?.payments[0].date).format('L'):'n\\a',
          'startDate': members[idx].activeMembership ? moment(members[idx].activeMembership?.startDate).format('L'):'n\\a',
          'expiryDate': members[idx].activeMembership ? this.getMembershipExpirationMoment(members[idx].activeMembership).format('L'):'n\\a'
        }
      );
    }
    const buffer = await wb.xlsx.writeBuffer({filename: 'member-report'});
    res.header('Content-Disposition', 'attachment; filename="member-report.xlsx"');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }

  @Post('/salesReport')
  async salesReport(@Req() req, @Res() res) {

  }

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
      const membershipExpirationDate = this.getMembershipExpirationMoment(activeMembership);

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
