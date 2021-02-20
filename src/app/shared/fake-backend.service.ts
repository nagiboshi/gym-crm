import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize} from 'rxjs/operators';
import {MembershipItem} from '../models/membership-item.model';
import {Member} from '../models/member.model';
import {PurchaseItem} from '../models/purchase.model';
import {MembershipService} from '../models/membership-service.model';
import {ScheduleMember} from '../models/schedule-member.model';
import * as _moment from 'moment';
import {Freeze} from '../models/freeze.model';

export const NAMES = ['Oleksandr', 'Ammar', 'Omar', 'Emad', 'Mohammed', 'Ahmed', 'Hamed', 'Nader', 'Nadine'];
export const LAST_NAMES = ['LastName1', 'LastName2', 'LastName3', 'LastName4'];
export const EMAILS = ['example@gmail.com', 'example2@gmail.com', 'example3@gmail.com', 'example4@gmail.com'];
export const PHONE_NUMBERS = ['0551678467', '0551111112', '0551111113', '0551111114', '0551111115', '0551111116'];
// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
const moment = _moment;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
const oneYearTimeStamp = moment().endOf('year').toDate().getTime() - moment().startOf('year').toDate().getTime();
const oneDayTimeStamp = moment().endOf('day').toDate().getTime() - moment().startOf('day').toDate().getTime();
const oneWeekTimeStamp = moment().endOf('week').toDate().getTime() - moment().startOf('week').toDate().getTime();
const oneMonthTimeStamp = moment().endOf('month').toDate().getTime() - moment().startOf('month').toDate().getTime();


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
    startDate: moment().subtract( oneWeekTimeStamp, 'milliseconds').toDate().getTime(),
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

const mapMemberToScheduleMember = (membrs: Member[]): ScheduleMember[] => {
  return membrs.map((m) => {
    return {
      member: m,
      id: getRandomInt(0, 10000),
      scheduleDate: new Date().getTime()
    };
  });
};

const schedules = [{
  id: 2,
  classId: 1,
  day: 0,
  signedMembers: mapMemberToScheduleMember(members.slice(0, 3)),
  capacity: 10,
  timeStart: 54800000,
  timeEnd: 58400000
},
  {
    id: 1,
    classId: 1,
    day: 0,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(1, 4)),
    timeStart: 64800000,
    timeEnd: 68400000
  },
  {
    id: 3,
    classId: 1,
    day: 2,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(2, 5)),
    timeStart: 64800000,
    timeEnd: 68400000
  },
  {
    id: 4,
    classId: 2,
    day: 0,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(3, 4)),
    timeStart: 68400000,
    timeEnd: 71400000
  },
  {
    id: 5,
    classId: 1,
    day: 3,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(0, 2)),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 6,
    classId: 2,
    day: 4,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(0, 4)),
    timeStart: 64800000,
    timeEnd: 68400000
  },
  {id: 7, classId: 3, day: 5, capacity: 10, signedMembers: null, timeStart: 64800000, timeEnd: 68400000},
  {
    id: 8,
    classId: 4,
    day: 6,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(2, 5)),
    timeStart: 68400000,
    timeEnd: 71400000
  },
  {
    id: 9,
    classId: 1,
    day: 0,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(3, 6)),
    timeStart: 64800000,
    timeEnd: 68400000
  },
  {
    id: 10,
    classId: 1,
    day: 2,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(2, 5)),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 11,
    classId: 2,
    day: 0,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(1, 4)),
    timeStart: 58400000,
    timeEnd: 61400000
  },
  {
    id: 12,
    classId: 1,
    day: 3,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(5, 6)),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 13,
    classId: 2,
    day: 4,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(2, 4)),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {
    id: 14,
    classId: 3,
    day: 5,
    capacity: 10,
    signedMembers: mapMemberToScheduleMember(members.slice(3, 6)),
    timeStart: 54800000,
    timeEnd: 58400000
  },
  {id: 15, classId: 4, day: 6, capacity: 10, signedMembers: null, timeStart: 58400000, timeEnd: 61400000}];

// const monthSchedule: MonthSchedule = {
// month: new Date().getMonth(),
// year: new Date().getFullYear(),
// daySchedule:
// }

const membershipServices: MembershipService[] = [{
  id: 1, name: 'Family Memberships', items: [
    {id: 1, expirationTime: oneYearTimeStamp, name: 'Annual Family Membership (2 Adults, 1 Kid)', isShared: true, familySize: 3},
    {id: 2, expirationTime: oneYearTimeStamp, name: 'Annual Family Membership (2 Adults, 2 Kids)', isShared: true, familySize: 4}
  ]
},
  {
    id: 2, name: 'Kids Membership', items: [
      {id: 3, expirationTime: oneDayTimeStamp, name: 'Day Pass'},
      {id: 4, expirationTime: 2 * oneWeekTimeStamp, name: 'Free Trial'},
      {id: 5, expirationTime: oneMonthTimeStamp, name: 'Kids BJJ 1 Month'},
      {id: 6, expirationTime: 3 * oneMonthTimeStamp, name: 'Kids BJJ 3 Months'},
      {id: 7, expirationTime: 6 * oneMonthTimeStamp, name: 'Kids BJJ 6 Months'},
      {id: 8, expirationTime: oneYearTimeStamp, name: 'Kids BJJ Annual'},
      {id: 9, expirationTime: oneMonthTimeStamp, name: 'Kids Muay Thai 1 Month'},
      {id: 10, expirationTime: 3 * oneMonthTimeStamp, name: 'Kids Muay Thai 3 Months'},
      {id: 11, expirationTime: 6 * oneMonthTimeStamp, name: 'Kids Muay Thai 6 Months'},
      {id: 12, expirationTime: oneYearTimeStamp, name: 'Kids Muay Thai Annual'},
      {id: 13, expirationTime: oneMonthTimeStamp, name: 'Kids BJJ and Muay Thai 1 Month'},
      {id: 14, expirationTime: 3 * oneMonthTimeStamp, name: 'Kids BJJ and Muay Thai 3 Month'},
      {id: 15, expirationTime: 6 * oneMonthTimeStamp, name: 'Kids BJJ and Muay Thai 6 Month'},
      {id: 16, expirationTime: oneYearTimeStamp, name: 'Kids BJJ and Muay Thai Annual'}
    ]
  },
  {
    id: 3, name: 'Martial Arts Package (All)', items: [
      {id: 17, expirationTime: oneMonthTimeStamp, name: '1 Month Martial Arts Package'},
      {id: 18, expirationTime: oneMonthTimeStamp * 3, name: '3 Month Martial Arts Package'},
      {id: 19, expirationTime: oneMonthTimeStamp * 6, name: '6 Month Martial Arts Package'},
      {id: 20, expirationTime: oneMonthTimeStamp * 12, name: 'Annual Month Martial Arts Package'},
      {id: 21, expirationTime: oneDayTimeStamp, name: 'Day Pass'},
      {id: 22, expirationTime: oneWeekTimeStamp, name: 'Free Trial'},
      {id: 23, expirationTime: oneDayTimeStamp * 10, name: 'Martial Arts 10 Class Pass'}
    ]
  },
  {
    id: 4, name: 'Martial Arts per Discipline', items: [
      {id: 24, expirationTime: oneMonthTimeStamp, name: 'BJJ 1 Month'},
      {id: 25, expirationTime: 3 * oneMonthTimeStamp, name: 'BJJ 3 Months'},
      {id: 26, expirationTime: 6 * oneMonthTimeStamp, name: 'BJJ 6 Months'},
      {id: 27, expirationTime: 12 * oneMonthTimeStamp, name: 'BJJ Annual'},
      {id: 28, expirationTime: oneMonthTimeStamp, name: 'Muay Thai 1 Month'},
      {id: 29, expirationTime: 3 * oneMonthTimeStamp, name: 'Muay Thai 3 Months'},
      {id: 30, expirationTime: oneMonthTimeStamp * 6, name: 'Muay Thai 6 Months'},
      {id: 31, expirationTime: 12 * oneMonthTimeStamp, name: 'Muay Thai Annual'},
      {id: 32, expirationTime: oneMonthTimeStamp, name: 'Boxing 1 Month'},
      {id: 33, expirationTime: 3 * oneMonthTimeStamp, name: 'Boxing 3 Months'},
      {id: 34, expirationTime: 6 * oneMonthTimeStamp, name: 'Boxing 6 Months'},
      {id: 35, expirationTime: 12 * oneMonthTimeStamp, name: 'Boxing Annual'},
      {id: 36, expirationTime: oneMonthTimeStamp, name: 'MMA 1 Month'},
      {id: 37, expirationTime: 3 * oneMonthTimeStamp, name: 'MMA 3 Months'},
      {id: 38, expirationTime: 6 * oneMonthTimeStamp, name: 'MMA 6 Months'},
      {id: 39, expirationTime: 12 * oneMonthTimeStamp, name: 'MMA Annual'},
      {id: 40, expirationTime: oneMonthTimeStamp, name: 'Wrestling 1 Month'},
      {id: 41, expirationTime: 3 * oneMonthTimeStamp, name: 'Wrestling 3 Month'},
      {id: 42, expirationTime: 6 * oneMonthTimeStamp, name: 'Wrestling 6 Month'},
      {id: 43, expirationTime: 12 * oneMonthTimeStamp, name: 'Wrestling Annual'},
      {id: 40, expirationTime: oneMonthTimeStamp, name: '2 Discipline 1 Month'},
      {id: 41, expirationTime: 3 * oneMonthTimeStamp, name: '2 Discipline 3 Month'},
      {id: 42, expirationTime: 6 * oneMonthTimeStamp, name: '2 Discipline 6 Month'},
      {id: 43, expirationTime: 12 * oneMonthTimeStamp, name: '2 Discipline Annual'},
    ]
  },
  {
    id: 5, name: 'Personal Training', items: [
      {id: 44, expirationTime: oneMonthTimeStamp, name: '1 on 1 PT'},
      {id: 45, expirationTime: oneMonthTimeStamp, name: '10 PT Sessions'},
      {id: 46, expirationTime: oneMonthTimeStamp, name: '20 PT Sessions'},
      {id: 47, expirationTime: oneMonthTimeStamp, name: '30 PT Sessions'},
      {id: 48, expirationTime: oneMonthTimeStamp, name: 'Semi Private Training'},
    ]
  },
  {
    id: 6, name: 'Unlimited Package', items: [
      {id: 49, expirationTime: oneMonthTimeStamp, name: '1 Month Unlimited Package'},
      {id: 50, expirationTime: 3 * oneMonthTimeStamp, name: '3 Months Unlimited Package'},
      {id: 51, expirationTime: 6 * oneMonthTimeStamp, name: '6 Months Unlimited Package'},
      {id: 52, expirationTime: 12 * oneMonthTimeStamp, name: 'Annual Unlimited Package'},
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
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        case url.match('/classes') && method == 'GET':
          return getClasses();
        case url.match('/member') && (method == 'PUT' || method == 'PATCH'):
          const member = request.body as Member;
          return mergeMember(member);
        case url.match(/\/members$/) && method == 'GET':
          const filterNameLastNameOrPhone = request.params.get('filterNameLastNameOrPhone');
          const offset = request.params.get('offset');
          const size = request.params.get('size');
          return getMembers(size, offset, filterNameLastNameOrPhone);
        case url.match(/\/member$/) && method == 'GET':
          // const memberId = url.match(/\/member\/\d+$/).groups[1];
          const id = parseInt(request.params.get('id'), 10);
          return getMember(id);
        case url.match(/\/memberships$/) && method == 'GET':
          return getMembershipServices();
        case url.match('/schedules') && method == 'GET':
          return getSchedules();
        case url.match('/schedules') && method == 'PUT':
          return addSchedules(body);
        case url.match('/purchase') && method == 'PUT':
          return addPurchase(body); //
        case url.match('/purchases') && method == 'GET':
          // const id = url.match(/\/purchases\/\d+$/).groups[1];
          return getMemberPurchases(parseInt(request.params.get('memberId'), 10));
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
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

    function getClasses() {
      return ok([
        {name: 'BJJ', id: 1},
        {name: 'MMA', id: 2},
        {name: 'Muay Thai', id: 3},
        {name: 'Wrestling', id: 4}]);
    }


    function freezePurchaseItem(newFreeze: Freeze) {
      const ids = freezes.map( f => f.id);
      const maxId = Math.max(...ids) + 1;
      const savedFreeze = {...newFreeze};
      savedFreeze.id = maxId;
      return ok(savedFreeze);
    }

    function addPurchase(purchaseBody: any) {
      const maxId = Math.max(..._getRandomPurchases(purchaseBody.memberId).map(p => p.id)) + 1;
      const savedPurchase = {...purchaseBody};
      savedPurchase.id = maxId;
      return ok(savedPurchase);
    }

    function _getRandomPurchases(memberId: number): PurchaseItem[] {
      const randomPackage1 = membershipServices[(getRandomInt(0, membershipServices.length))];
      const randomItem1: MembershipItem = randomPackage1.items[getRandomInt(0, randomPackage1.items.length - 1)];
      const randomPackage2 = membershipServices[(getRandomInt(0, membershipServices.length))];
      const randomItem2: MembershipItem = randomPackage2.items[getRandomInt(0, randomPackage2.items.length - 1)];
      const randomPackage3 = membershipServices[(getRandomInt(0, membershipServices.length))];
      const randomItem3: MembershipItem = randomPackage3.items[getRandomInt(0, randomPackage3.items.length - 1)];

      const getRandomTime = () => {
        return new Date().getTime() - getRandomInt(0, 12 * 30 * 24 * 60 * 60 * 60 * 10);
      };
      return [{
        id: 1,
        memberId,
        saleDate: getRandomTime(),
        startDate: getRandomTime(),
        freezes: [
          freezes[0], freezes[1]
        ],
        note: 'sell his house to buy a membership',
        price: getRandomInt(0, 10000),
        item: randomItem1
      },
        {
          id: 2,
          memberId,
          saleDate: getRandomTime(),
          startDate: getRandomTime(),
          note: 'bought with a credit payment',
          price: getRandomInt(0, 10000),
          item: randomItem2,
          freezes: [freezes[2]]
        },
        {
          id: 3,
          memberId,
          saleDate: getRandomTime(),
          startDate: getRandomTime(),
          note: 'bought with a credit payment',
          price: getRandomInt(0, 10000),
          item: randomItem3
        }];
    }

    function getMemberPurchases(memberId: number) {
      return ok(_getRandomPurchases(memberId));
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

    function getSchedules() {
      return ok(schedules);
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
