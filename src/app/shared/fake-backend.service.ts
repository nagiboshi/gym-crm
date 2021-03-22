import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {MembershipItem} from '../models/membership-item.model';
import {Member} from '../models/member.model';
import {PurchaseItem} from '../models/purchase.model';
import {MembershipService} from '../models/membership-service.model';
import {ScheduleMember} from '../models/schedule-member.model';
import * as _moment from 'moment';
import {Freeze} from '../models/freeze.model';
import {clone as copy, remove} from 'lodash';
import {extendMoment} from 'moment-range';
import {ClassModel} from '../classes/class.model';
import {FITNESS_CLASS_TYPE, MARTIAL_ARTS_CLASS_TYPE} from '../models/class-type';
import {PaymentMethod} from '../models/payment-method';
import {ClassCategory} from '../classes/class.category';

export const NAMES = ['Oleksandr', 'Ammar', 'Omar', 'Emad', 'Mohammed', 'Ahmed', 'Hamed', 'Nader', 'Nadine'];
// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
const moment = extendMoment(_moment);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

let lastScheduleId = 1;
const oneDayTimeStamp = 8.64e+7;
const oneYearTimeStamp = moment().endOf('year').toDate().getTime() - moment().startOf('year').toDate().getTime();
const oneWeekTimeStamp = moment().endOf('week').toDate().getTime() - moment().startOf('week').toDate().getTime();
const oneMonthTimeStamp = moment().endOf('month').toDate().getTime() - moment().startOf('month').toDate().getTime();


const classCategories: ClassCategory[] = [{id: 1, name: 'Martial Arts'}, {id: 2, name: 'Fitness'}];

const classes: ClassModel[] = [{name: 'BJJ', id: 1, categoryId: 1},
  {name: 'MMA', id: 2, categoryId: 1},
  {name: 'Muay Thai', id: 3, categoryId: 1},
  {name: 'Wrestling', id: 4, categoryId: 1},
  {name: 'Core', id: 5, categoryId: 2}
];

const paymentMethods: PaymentMethod[] = [{id: 1, name: 'Cash'},
  {id: 2, name: 'Cheque'},
  {id: 3, name: 'Amex'},
  {id: 4, name: 'Visa/MC'},
  {id: 5, name: 'Discover'},
  {id: 6, name: 'Credit (ATM) (No Auth)'},
  {id: 7, name: 'Other'}];

const freezes: Freeze[] = [{
  id: 1,
  purchaseId: 1,
  startDate: moment().subtract(3 * oneWeekTimeStamp, 'milliseconds').toDate().getTime(),
  endDate: moment().subtract(oneWeekTimeStamp, 'milliseconds').toDate().getTime()
},
  {
    id: 2,
    purchaseId: 1,
    startDate: moment().subtract(6 * oneWeekTimeStamp, 'milliseconds').toDate().getTime(),
    endDate: moment().subtract(5 * oneWeekTimeStamp, 'milliseconds').toDate().getTime()
  },
  {
    id: 3,
    purchaseId: 2,
    startDate: moment().subtract(oneWeekTimeStamp, 'milliseconds').toDate().getTime(),
  }];

const members: Member[] = [
  {
    id: 1,
    firstName: 'Oleksandr',
    lastName: 'Afanasiev',
    phoneNumber: '0551678467',
    email: 'ol.afanasiev@gmail.com',
    gender: 'male',
    photoLink: '/assets/oleksandr.png',
    family: [{
      id: 5,
      firstName: 'Polina',
      lastName: 'Afanasieva',
      phoneNumber: '0111111',
      email: 'polina@gmail.com',
      photoLink: '/assets/polina.png',
      gender: 'female'
    },
      {
        id: 6,
        firstName: 'Anastasiia',
        lastName: 'Afanasieva',
        phoneNumber: '02222222',
        gender: 'female',
        photoLink: '/assets/polina.png',
        email: 'fishku@gmail.com'
      }],
    referalType: 'google',
    referalMember: {
      id: 2,
      firstName: 'Andrew',
      lastName: 'Bondarenko',
      phoneNumber: '0551678465',
      email: 'andrew.bond@gmail.com',
      gender: 'male',
      photoLink: '/assets/andrew.png'
    },
    notes: 'All time forget his smart watches',
  },
  {
    id: 2,
    firstName: 'Andrew',
    lastName: 'Bondarenko',
    phoneNumber: '0551678465',
    email: 'andrew.bond@gmail.com',
    gender: 'male',
    photoLink: '/assets/andrew.png'
  },
  {
    id: 3,
    firstName: 'Nader',
    lastName: 'Nader',
    phoneNumber: '0552222314',
    email: 'nader@gmail.com',
    gender: 'male',
    photoLink: '/assets/nader.png'
  },
  {
    id: 4,
    firstName: 'Khatib',
    lastName: 'Khatib',
    phoneNumber: '0551231124',
    email: 'khatib@gmail.com',
    gender: 'male',
    photoLink: '/assets/khatib.png'
  },
  {
    id: 5,
    firstName: 'Polina',
    lastName: 'Afanasieva',
    phoneNumber: '0111111',
    email: 'polina@gmail.com',
    photoLink: '/assets/polina.png',
    gender: 'female'
  },
  {
    id: 6,
    firstName: 'Anastasiia',
    lastName: 'Afanasieva',
    phoneNumber: '02222222',
    gender: 'female',
    photoLink: '/assets/polina.png',
    email: 'fishku@gmail.com'
  }
];

const mapMemberToScheduleMember = (membrs: Member[], day: number): ScheduleMember[] => {
  return membrs.map((m) => {
    const date = moment().startOf('week');
    date.add(day, 'day');
    return {
      member: m,
      id: lastScheduleId++,
      scheduleDate: date.toDate().getTime()
    };
  });
};
const today = moment();
const schedules = [{
  id: 2,
  classId: 1,
  day: 0,
  signedMembers: mapMemberToScheduleMember(members.slice(0, 3), 0),
  capacity: 10,
  timeStart: 54800000,
  scheduleFrom: today.clone().subtract(10, 'day').toDate().getTime(),
  scheduleUntil: today.clone().add(30, 'day').toDate().getTime(),
  timeEnd: 58400000
},
  {
    id: 1,
    classId: 1,
    day: 0,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(1, 4), 0),
    scheduleFrom: today.clone().subtract(20, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(30, 'day').toDate().getTime(),
    timeStart: 64800000,
    timeEnd: 68400000
  },
  {
    id: 3,
    classId: 1,
    day: 2,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(2, 5), 2),
    scheduleFrom: today.clone().subtract(10, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(50, 'day').toDate().getTime(),
    timeStart: 64800000,
    timeEnd: 68400000
  },
  {
    id: 4,
    classId: 2,
    day: 0,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(3, 4), 0),
    scheduleFrom: today.clone().subtract(1, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(4, 'day').toDate().getTime(),
    timeStart: 68400000,
    timeEnd: 71400000
  },
  {
    id: 5,
    classId: 1,
    day: 3,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(0, 2), 3),
    scheduleFrom: today.clone().subtract(10, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(30, 'day').toDate().getTime(),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 6,
    classId: 2,
    day: 4,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(0, 4), 4),
    scheduleFrom: today.clone().subtract(10, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(30, 'day').toDate().getTime(),
    timeStart: 64800000,
    timeEnd: 68400000
  },
  {
    id: 7,
    classId: 3,
    day: 5,
    capacity: 10,
    signedMembers: null,
    timeStart: 64800000,
    timeEnd: 68400000,
    scheduleFrom: today.clone().subtract(10, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(30, 'day').toDate().getTime()
  },
  {
    id: 8,
    classId: 4,
    day: 6,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(2, 5), 6),
    scheduleFrom: today.clone().subtract(2, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(2, 'day').toDate().getTime(),
    timeStart: 68400000,
    timeEnd: 71400000
  },
  {
    id: 9,
    classId: 1,
    day: 0,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(3, 6), 0),
    scheduleFrom: today.clone().subtract(4, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(1, 'day').toDate().getTime(),
    timeStart: 64800000,
    timeEnd: 68400000
  },
  {
    id: 10,
    classId: 1,
    day: 2,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(2, 5), 2),
    scheduleFrom: today.clone().subtract(5, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(8, 'day').toDate().getTime(),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 11,
    classId: 2,
    day: 0,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(1, 4), 0),
    scheduleFrom: today.clone().subtract(1, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(1, 'day').toDate().getTime(),
    timeStart: 58400000,
    timeEnd: 61400000
  },
  {
    id: 12,
    classId: 1,
    day: 3,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(5, 6), 3),
    scheduleFrom: today.clone().subtract(0, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(50, 'day').toDate().getTime(),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 13,
    classId: 2,
    day: 4,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(2, 4), 4),
    scheduleFrom: today.clone().subtract(10, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(30, 'day').toDate().getTime(),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 14,
    classId: 3,
    day: 5,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(3, 6), 5),
    scheduleFrom: today.clone().subtract(10, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(30, 'day').toDate().getTime(),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 15, classId: 4, day: 6, capacity: 10, signedMembers: null, timeStart: 58400000,
    scheduleFrom: today.clone().subtract(10, 'day').toDate().getTime(),
    scheduleUntil: today.clone().add(30, 'day').toDate().getTime(),
    timeEnd: 61400000
  }];

// const monthSchedule: MonthSchedule = {
// month: new Date().getMonth(),
// year: new Date().getFullYear(),
// daySchedule:
// }

const membershipServices: MembershipService[] = [{
  id: 1, name: 'Family Memberships', items: [
    {id: 1, expirationType: 'year', expirationLength: 1, name: 'Annual Family Membership (2 Adults, 1 Kid)', isShared: true, familySize: 3},
    {id: 2, expirationType: 'year', expirationLength: 1, name: 'Annual Family Membership (2 Adults, 2 Kids)', isShared: true, familySize: 4}
  ]
},
  {
    id: 2, name: 'Kids Membership', items: [
      {id: 3, expirationType: 'day', expirationLength: 1, name: 'Day Pass'},
      {id: 4, expirationType: 'day', expirationLength: 14, name: 'Free Trial'},
      {id: 5, expirationType: 'month', expirationLength: 1, name: 'Kids BJJ 1 Month'},
      {id: 6, expirationType: 'month', expirationLength: 3, name: 'Kids BJJ 3 Months'},
      {id: 7, expirationType: 'month', expirationLength: 6, name: 'Kids BJJ 6 Months'},
      {id: 8, expirationType: 'year', expirationLength: 1, name: 'Kids BJJ Annual'},
      {id: 9, expirationType: 'month', expirationLength: 1, name: 'Kids Muay Thai 1 Month'},
      {id: 10, expirationType: 'month', expirationLength: 3, name: 'Kids Muay Thai 3 Months'},
      {id: 11, expirationType: 'month', expirationLength: 6, name: 'Kids Muay Thai 6 Months'},
      {id: 12, expirationType: 'year', expirationLength: 1, name: 'Kids Muay Thai Annual'},
      {id: 13, expirationType: 'month', expirationLength: 1, name: 'Kids BJJ and Muay Thai 1 Month'},
      {id: 14, expirationType: 'month', expirationLength: 3, name: 'Kids BJJ and Muay Thai 3 Month'},
      {id: 15, expirationType: 'month', expirationLength: 6, name: 'Kids BJJ and Muay Thai 6 Month'},
      {id: 16, expirationType: 'year', expirationLength: 1, name: 'Kids BJJ and Muay Thai Annual'}
    ]
  },
  {
    id: 3, name: 'Martial Arts Package (All)', items: [
      {id: 17, expirationType: 'month', expirationLength: 1, name: '1 Month Martial Arts Package'},
      {id: 18, expirationType: 'month', expirationLength: 3, name: '3 Month Martial Arts Package'},
      {id: 19, expirationType: 'month', expirationLength: 6, name: '6 Month Martial Arts Package'},
      {id: 20, expirationType: 'year', expirationLength: 1, name: 'Annual Month Martial Arts Package'},
      {id: 21, expirationType: 'day', expirationLength: 1, name: 'Day Pass'},
      {id: 22, expirationType: 'day', expirationLength: 14, name: 'Free Trial'},
      {id: 23, expirationType: 'day', expirationLength: 10, name: 'Martial Arts 10 Class Pass'}
    ]
  },
  {
    id: 4, name: 'Martial Arts per Discipline', items: [
      {id: 24, expirationType: 'month', expirationLength: 1, name: 'BJJ 1 Month'},
      {id: 25, expirationType: 'month', expirationLength: 3, name: 'BJJ 3 Months'},
      {id: 26, expirationType: 'month', expirationLength: 6, name: 'BJJ 6 Months'},
      {id: 27, expirationType: 'year', expirationLength: 1, name: 'BJJ Annual'},
      {id: 28, expirationType: 'month', expirationLength: 1, name: 'Muay Thai 1 Month'},
      {id: 29, expirationType: 'month', expirationLength: 3, name: 'Muay Thai 3 Months'},
      {id: 30, expirationType: 'month', expirationLength: 6, name: 'Muay Thai 6 Months'},
      {id: 31, expirationType: 'year', expirationLength: 1, name: 'Muay Thai Annual'},
      {id: 32, expirationType: 'month', expirationLength: 1, name: 'Boxing 1 Month'},
      {id: 33, expirationType: 'month', expirationLength: 3, name: 'Boxing 3 Months'},
      {id: 34, expirationType: 'month', expirationLength: 6, name: 'Boxing 6 Months'},
      {id: 35, expirationType: 'year', expirationLength: 1, name: 'Boxing Annual'},
      {id: 36, expirationType: 'month', expirationLength: 1, name: 'MMA 1 Month'},
      {id: 37, expirationType: 'month', expirationLength: 3, name: 'MMA 3 Months'},
      {id: 38, expirationType: 'month', expirationLength: 6, name: 'MMA 6 Months'},
      {id: 39, expirationType: 'year', expirationLength: 1, name: 'MMA Annual'},
      {id: 40, expirationType: 'month', expirationLength: 1, name: 'Wrestling 1 Month'},
      {id: 41, expirationType: 'month', expirationLength: 3, name: 'Wrestling 3 Month'},
      {id: 42, expirationType: 'month', expirationLength: 6, name: 'Wrestling 6 Month'},
      {id: 43, expirationType: 'year', expirationLength: 1, name: 'Wrestling Annual'},
      {id: 40, expirationType: 'month', expirationLength: 1, name: '2 Discipline 1 Month'},
      {id: 41, expirationType: 'month', expirationLength: 3, name: '2 Discipline 3 Month'},
      {id: 42, expirationType: 'month', expirationLength: 6, name: '2 Discipline 6 Month'},
      {id: 43, expirationType: 'year', expirationLength: 1, name: '2 Discipline Annual'},
    ]
  },
  {
    id: 5, name: 'Personal Training', items: [
      {id: 44, expirationType: 'day', expirationLength: 1, name: '1 on 1 PT'},
      {id: 45, expirationType: 'day', expirationLength: 10, name: '10 PT Sessions'},
      {id: 46, expirationType: 'day', expirationLength: 20, name: '20 PT Sessions'},
      {id: 47, expirationType: 'month', expirationLength: 1, name: '30 PT Sessions'},
      {id: 48, expirationType: 'day', expirationLength: 1, name: 'Semi Private Training'},
    ]
  },
  {
    id: 6, name: 'Unlimited Package', items: [
      {id: 49, expirationType: 'month', expirationLength: 1, name: '1 Month Unlimited Package'},
      {id: 50, expirationType: 'month', expirationLength: 3, name: '3 Months Unlimited Package'},
      {id: 51, expirationType: 'month', expirationLength: 6, name: '6 Months Unlimited Package'},
      {id: 52, expirationType: 'year', expirationLength: 1, name: 'Annual Unlimited Package'},
    ]
  }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {


      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/freeze') && method === 'POST':
          return freezePurchaseItem(request.body as Freeze);
        case url.endsWith('/freeze') && method === 'GET':
          return findFreeze(parseInt(request.params.get('purchaseId'), 10), parseInt(request.params.get('startDate'), 10));
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.match('/signMembers') && method === 'POST':
          return signMembers(parseInt(body.params.get('scheduleId'), 10),
            parseInt(body.params.get('date'), 10),
            body.params.getAll('memberIds').map(m => parseInt(m, 10)));
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        case url.match('/classes') && method == 'GET':
          return getClasses();
        case url.match('/class') && method == 'PUT': {
          const classModel: ClassModel = request.body as ClassModel;
          return mergeClasses(classModel);
        }
        case url.match('/class') && method == 'DELETE': {
          return removeClass(parseInt(request.params.get('id')));
        }
        case url.match('/members') && (method == 'PUT' || method == 'PATCH'):
          const member = request.body as Member;
          return mergeMember(member);
        case url.match(/\/members$/) && method == 'GET':
          const filterNameLastNameOrPhone = request.params.get('filterNameLastNameOrPhone');
          const offset = request.params.get('offset');
          const size = request.params.get('size');
          return getMembers(size, offset, filterNameLastNameOrPhone);
        case url.match(/\/members\/\d+$/) && method == 'GET':
          const id = idFromUrl();
          return getMember(id);
        case url.match(/\/memberships$/) && method == 'GET':
          return getMembershipServices();
        case url.match('/schedules') && method == 'GET':
          const from = request.params.get('from');
          const to = request.params.get('to');
          return getSchedules(parseInt(from, 10), parseInt(to, 10));
        case url.match('/schedules') && method == 'PUT':
          return addSchedules(body);
        case url.match('/purchase') && method == 'PUT':
          return addPurchase(body); //
        case url.match('/paymentMethod') && method == 'GET':
          return getPaymentMethods(); //
        case url.match('/paymentMethod') && method == 'PUT':
          return addPaymentMethod(body); //
        case url.match(/\/paymentMethod\/\d+$/) && method == 'DELETE':
          return deletePaymentMethod(); //
        case url.startsWith('/purchasesFromTo') && method == 'GET':
          return getPurchaseItems(parseInt(request.params.get('from'), 10), parseInt(request.params.get('to'), 10));
        case url.match('/purchases') && method == 'GET':
          return getMemberPurchases(parseInt(request.params.get('memberId'), 10));
        case url.match('/classCategories') && method == 'GET':
          return getClassCategories();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }


    function signMembers(scheduleId: number, date: number, memberIds: number[]) {
      const schedule = schedules.find(s => s.id == scheduleId);
      const members1 = members.filter(m => memberIds.includes(m.id));

      const scheduleMembers: ScheduleMember[] = members1.map((m) => {
        return {id: lastScheduleId++, member: m, scheduleDate: date};
      });

      schedule.signedMembers = [...scheduleMembers, ...schedule.signedMembers];
      return ok(scheduleMembers);
    }

    function getClassCategories() {
      return ok(copy(classCategories));
    }

    function getMember(id) {
      const member = members.find(m => m.id == id);
      return ok(member);
    }

    function getMonthSchedule(year, month, week) {
      // const member = members.find(m => m.id == id);
      return ok();
    }


    function mergeMember(member: Member) {
      if (member.id != 0) {
        const index = members.findIndex(m => m.id == member.id);
        members[index] = Object.assign(members[index], member);
      } else {
        let newId = Math.max(...(members.map(mbr => mbr.id)));
        newId++;
        member.id = newId;
        members.push(member);
      }
      return ok(member);
    }


    function getMembers(size, offset, filter) {
      let resultedMembers;
      if (filter && filter.length > 0) {
        resultedMembers = members.filter(m => m.firstName.includes(filter)
          || m.lastName.includes(filter)
          || m.phoneNumber.includes(filter));
      } else {
        resultedMembers = members;
      }
      resultedMembers = [...resultedMembers].splice(offset, size);
      return ok(resultedMembers);
    }


    function getClasses(): Observable<any> {
      return ok([...classes]);
    }

    function removeClass(id: number) {
      remove(classes, c => c.id == id);
      return ok();
    }

    function mergeClasses(classModel: ClassModel) {
      let id;
      if (classModel.id == 0) {
        id = Math.max(...classes.map(c => c.id)) + 1;
      } else {
        id = classModel.id;
      }
      const savedClassModel = {...classModel, ...{id}};

      if (classModel.id == 0) {
        classes.push(savedClassModel);
      } else {
        const index = classes.findIndex(c => c.id == classModel.id);
        classes[index] = savedClassModel;
      }
      return ok(savedClassModel);
    }

    function findFreeze(purchaseId: number, startDate: number) {
      return ok(freezes.find(f => f.startDate == startDate && f.purchaseId == purchaseId));
    }

    function freezePurchaseItem(newFreeze: Freeze) {
      const ids = freezes.map(f => f.id);
      const maxId = Math.max(...ids) + 1;
      const savedFreeze = {...newFreeze};
      savedFreeze.id = maxId;
      const existFreezeIndex = freezes.findIndex(f => f.id == newFreeze.id);
      if (existFreezeIndex != -1) {
        freezes.splice(existFreezeIndex, 1, savedFreeze);
      } else {
        freezes.push(savedFreeze);
      }

      return ok(savedFreeze);
    }


    function addPurchase(purchaseBody: any) {
      const maxId = Math.max(..._getRandomPurchases(purchaseBody.memberId).map(p => p.id)) + 1;
      const savedPurchase = {...purchaseBody};
      savedPurchase.id = maxId;
      return ok(savedPurchase);
    }

    function _getRandomPurchases(memberId: number, from?: number, to?: number): PurchaseItem[] {
      const randomPackage1 = membershipServices[(getRandomInt(0, membershipServices.length))];
      const randomItem1: MembershipItem = copy(randomPackage1.items[getRandomInt(0, randomPackage1.items.length - 1)]);
      const randomPackage2 = membershipServices[(getRandomInt(0, membershipServices.length))];
      const randomItem2: MembershipItem = copy(randomPackage2.items[getRandomInt(0, randomPackage2.items.length - 1)]);
      const randomPackage3 = membershipServices[(getRandomInt(0, membershipServices.length))];
      const randomItem3: MembershipItem = copy(randomPackage3.items[getRandomInt(0, randomPackage3.items.length - 1)]);

      const getRandomTime = () => {
        return new Date().getTime() - getRandomInt(0, 12 * 30 * 24 * 60 * 60 * 60 * 10);
      };

      const today = moment();
      const randomPurchases = [{
        id: 1,
        memberId,
        saleDate: today.clone().subtract(randomItem1.expirationLength, randomItem1.expirationType).toDate().getTime(),
        // startDate1 - getRandomInt(0, 1000 * 60 * 60 * 24),
        startDate: today.clone()
          .subtract(randomItem1.expirationLength, randomItem1.expirationType)
          .toDate().getTime() + 2 * oneDayTimeStamp, // expired
        isFreezed: false,
        note: 'sell his house to buy a membership',
        price: getRandomInt(0, 10000),
        paymentMethodId: paymentMethods[getRandomInt(0, paymentMethods.length - 1)].id,
        item: randomItem1,
      },
        {
          id: 2,
          memberId,
          saleDate: today.clone().subtract(randomItem2.expirationLength, randomItem2.expirationType).toDate().getTime(),
          startDate: today.clone()
            .subtract(randomItem2.expirationLength, randomItem2.expirationType)
            .toDate().getTime() + 30 * oneDayTimeStamp,
          note: 'bought with a credit payment',
          price: getRandomInt(0, 10000),
          item: randomItem2,
          isFreezed: true,
          paymentMethodId: paymentMethods[getRandomInt(0, paymentMethods.length - 1)].id,
          lastFreezeTs: freezes[2].startDate
        },
        {
          id: 3,
          memberId,
          saleDate: today.clone().subtract(randomItem3.expirationLength, randomItem3.expirationType).toDate().getTime(),
          startDate: memberId == 5 ? Date.now() :
            today.clone().subtract(randomItem3.expirationLength, randomItem3.expirationType).toDate().getTime(), // nearly expired
          note: 'bought with a credit payment',
          price: getRandomInt(0, 10000),
          item: randomItem3,
          paymentMethodId: paymentMethods[getRandomInt(0, paymentMethods.length - 1)].id,
          isFreezed: false,
        }];

      return randomPurchases;
    }

    function getMemberPurchases(memberId: number) {
      return ok(_getRandomPurchases(memberId));
    }

    function getPaymentMethods() {
      return ok(copy(paymentMethods));
    }

    function addPaymentMethod(paymentMethod: PaymentMethod) {
      paymentMethod = copy(paymentMethod);
      let id;
      if (paymentMethod.id == 0) {
        id = Math.max(...paymentMethods.map(s => s.id));
      } else {
        id = paymentMethod.id;
      }
      paymentMethod.id = id;
      paymentMethods.push(paymentMethod);
      return ok(paymentMethod);
    }

    function deletePaymentMethod() {
      const id = idFromUrl();
      const isRemoved = remove(paymentMethods, m => m.id == id).length > 0;
      return ok(isRemoved);
    }

    function getPurchaseItems(from: number, to: number) {
      const result = [];
      for (const member of members) {
        result.push(..._getRandomPurchases(member.id));
      }
      return ok(result);
    }

    // route functions
    function getRandomBool() {
      return Math.random() > 0.5;
    }

    function authenticate() {
      const {username, password} = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) {
        return error('Username or password is incorrect');
      }
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: 'fake-jwt-token'
      });
    }

    function getMembershipServices() {
      return ok(membershipServices);
    }

    function getSchedules(from: number, to: number) {

      return ok(copy(schedules).filter((s) => {
        // debugger;
        const range = moment().range(new Date(from), new Date(to));
        // means schedule date is less then from filter  ( less means after from filter )
        // console.log("s.scheduleFrom >= from && s.scheduleFrom <= to"  , s.scheduleFrom, from, to);
        return range.contains(new Date(s.scheduleFrom)) || range.contains(new Date(s.scheduleUntil));
      }));
    }

    function addSchedules(schedulesToSave) {
      let id = Math.max(...schedules.map(s => s.id));
      schedulesToSave.forEach(s => s.id = id++);
      schedules.push(...schedulesToSave);
      return ok(schedulesToSave);
    }


    function register() {
      const user = body;

      if (users.find(x => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken');
      }

      user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      return ok();
    }

    function getUsers() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      return ok(users);
    }

    function deleteUser() {
      if (!isLoggedIn()) {
        return unauthorized();
      }

      users = users.filter(x => x.id !== idFromUrl());
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }

    // helper functions

    function ok(body?: any) {
      return of(new HttpResponse({status: 200, body}));
    }

    function error(message) {
      return throwError({error: {message}});
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: 'Unauthorised'}});
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1], 10);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
//
