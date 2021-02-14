import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize} from 'rxjs/operators';
import {MembershipItem} from '../models/membership-item.model';
import {Member} from '../models/member.model';
import {PurchaseItem} from '../models/purchase.model';
import {MembershipService} from '../models/membership-service.model';
import {ScheduleMember} from '../models/schedule-member.model';

export const NAMES = ['Oleksandr', 'Ammar', 'Omar', 'Emad', 'Mohammed', 'Ahmed', 'Hamed', 'Nader', 'Nadine'];
export const LAST_NAMES = ['LastName1', 'LastName2', 'LastName3', 'LastName4'];
export const EMAILS = ['example@gmail.com', 'example2@gmail.com', 'example3@gmail.com', 'example4@gmail.com'];
export const PHONE_NUMBERS = ['0551678467', '0551111112', '0551111113', '0551111114', '0551111115', '0551111116'];
// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

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

const schedules = [{id: 2, classId: 1, day: 0, signedMembers: mapMemberToScheduleMember(members.slice(0, 3)), capacity: 10, timeStart: 54800000, timeEnd: 58400000},
  {id: 1, classId: 1, day: 0, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(1, 4)), timeStart: 64800000, timeEnd: 68400000},
  {id: 3, classId: 1, day: 2, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(2, 5)), timeStart: 64800000, timeEnd: 68400000},
  {id: 4, classId: 2, day: 0, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(3, 4)), timeStart: 68400000, timeEnd: 71400000},
  {id: 5, classId: 1, day: 3, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(0, 2)), timeStart: 54800000, timeEnd: 58400000},
  {id: 6, classId: 2, day: 4, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(0, 4)), timeStart: 64800000, timeEnd: 68400000},
  {id: 7, classId: 3, day: 5, capacity: 10, signedMembers: null, timeStart: 64800000, timeEnd: 68400000},
  {id: 8, classId: 4, day: 6, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(2, 5)), timeStart: 68400000, timeEnd: 71400000},
  {id: 9, classId: 1, day: 0, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(3, 6)), timeStart: 64800000, timeEnd: 68400000},
  {id: 10, classId: 1, day: 2, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(2, 5)), timeStart: 54800000, timeEnd: 58400000},
  {id: 11, classId: 2, day: 0, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(1, 4)), timeStart: 58400000, timeEnd: 61400000},
  {id: 12, classId: 1, day: 3, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(5, 6)), timeStart: 54800000, timeEnd: 58400000},
  {id: 13, classId: 2, day: 4, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(2, 4)), timeStart: 54800000, timeEnd: 58400000},
  {id: 14, classId: 3, day: 5, capacity: 10, signedMembers: mapMemberToScheduleMember(members.slice(3, 6)), timeStart: 54800000, timeEnd: 58400000},
  {id: 15, classId: 4, day: 6, capacity: 10, signedMembers: null, timeStart: 58400000, timeEnd: 61400000}];

// const monthSchedule: MonthSchedule = {
  // month: new Date().getMonth(),
  // year: new Date().getFullYear(),
  // daySchedule:
// }

const membershipServices: MembershipService[] = [{
  id: 1, name: 'Family Memberships', items: [
    {id: 1, price: 15000, name: 'Annual Family Membership (2 Adults, 1 Kid)', isShared: true, familySize: 3},
    {id: 2, price: 12500, name: 'Annual Family Membership (2 Adults, 2 Kids)', isShared: true, familySize: 4}
  ]
},
  {
    id: 2, name: 'Kids Membership', items: [
      {id: 3, price: 70, name: 'Day Pass'},
      {id: 4, price: 0, name: 'Free Trial'},
      {id: 5, price: 599, name: 'Kids BJJ 1 Month'},
      {id: 6, price: 1399, name: 'Kids BJJ 3 Months'},
      {id: 7, price: 2475, name: 'Kids BJJ 6 Months'},
      {id: 8, price: 4380, name: 'Kids BJJ Annual'},
      {id: 9, price: 599, name: 'Kids Muay Thai 1 Month'},
      {id: 10, price: 1399, name: 'Kids Muay Thai 3 Months'},
      {id: 11, price: 2475, name: 'Kids Muay Thai 6 Months'},
      {id: 12, price: 4380, name: 'Kids Muay Thai Annual'},
      {id: 13, price: 951, name: 'Kids BJJ and Muay Thai 1 Month'},
      {id: 14, price: 1799, name: 'Kids BJJ and Muay Thai 3 Month'},
      {id: 15, price: 3047, name: 'Kids BJJ and Muay Thai 6 Month'},
      {id: 16, price: 5999, name: 'Kids BJJ and Muay Thai Annual'}
    ]
  },
  {
    id: 3, name: 'Martial Arts Package (All)', items: [
      {id: 17, price: 1100, name: '1 Month Martial Arts Package'},
      {id: 18, price: 2380, name: '3 Month Martial Arts Package'},
      {id: 19, price: 4189, name: '6 Month Martial Arts Package'},
      {id: 20, price: 6570, name: 'Annual Month Martial Arts Package'},
      {id: 21, price: 70, name: 'Day Pass'},
      {id: 22, price: 0, name: 'Free Trial'},
      {id: 23, price: 600, name: 'Martial Arts 10 Class Pass'}
    ]
  },
  {
    id: 4, name: 'Martial Arts per Discipline', items: [
      {id: 24, price: 500, name: 'BJJ 1 Month'},
      {id: 25, price: 1199, name: 'BJJ 3 Months'},
      {id: 26, price: 2200, name: 'BJJ 6 Months'},
      {id: 27, price: 4200, name: 'BJJ Annual'},
      {id: 28, price: 500, name: 'Muay Thai 1 Month'},
      {id: 29, price: 1199, name: 'Muay Thai 3 Months'},
      {id: 30, price: 2200, name: 'Muay Thai 6 Months'},
      {id: 31, price: 4200, name: 'Muay Thai Annual'},
      {id: 32, price: 500, name: 'Boxing 1 Month'},
      {id: 33, price: 1199, name: 'Boxing 3 Months'},
      {id: 34, price: 2200, name: 'Boxing 6 Months'},
      {id: 35, price: 4200, name: 'Boxing Annual'},
      {id: 36, price: 500, name: 'MMA 1 Month'},
      {id: 37, price: 1199, name: 'MMA 3 Months'},
      {id: 38, price: 2200, name: 'MMA 6 Months'},
      {id: 39, price: 4200, name: 'MMA Annual'},
      {id: 40, price: 500, name: 'Wrestling 1 Month'},
      {id: 41, price: 1199, name: 'Wrestling 3 Month'},
      {id: 42, price: 2200, name: 'Wrestling 6 Month'},
      {id: 43, price: 4200, name: 'Wrestling Annual'},
      {id: 40, price: 856, name: '2 Discipline 1 Month'},
      {id: 41, price: 1999, name: '2 Discipline 3 Month'},
      {id: 42, price: 3800, name: '2 Discipline 6 Month'},
      {id: 43, price: 5000, name: '2 Discipline Annual'},
    ]
  },
  {
    id: 5, name: 'Personal Training', items: [
      {id: 44, price: 300, name: '1 on 1 PT'},
      {id: 45, price: 2380, name: '10 PT Sessions'},
      {id: 46, price: 4189, name: '20 PT Sessions'},
      {id: 47, price: 6570, name: '30 PT Sessions'},
      {id: 48, price: 0, name: 'Semi Private Training'},
    ]
  },
  {
    id: 6, name: 'Unlimited Package', items: [
      {id: 49, price: 1522, name: '1 Month Unlimited Package'},
      {id: 50, price: 3999, name: '3 Months Unlimited Package'},
      {id: 51, price: 5237, name: '6 Months Unlimited Package'},
      {id: 52, price: 7999, name: 'Annual Unlimited Package'},
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

      return [{id: 1, memberId, item: randomItem1, qty: getRandomInt(0, 3)},
        {id: 2, memberId, item: randomItem2, qty: getRandomInt(0, 3)},
        {id: 3, memberId, item: randomItem3, qty: getRandomInt(0, 3)}];
    }

    function getMemberPurchases(memberId: number) {
      return ok(_getRandomPurchases(memberId));
    }

    // route functions

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
