import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Member} from './models/member.model';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

interface AppRoute {
  label: string;
  path: string;
  isActive: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  appRoutes$: BehaviorSubject<AppRoute[]> = new BehaviorSubject([{label: 'Schedules', isActive: false, path: '/classes/schedules'},
    {label: 'Members', isActive: false,  path: '/members'}
  ]);
  title = 'primal-accounting';
  constructor(private router: Router, cd: ChangeDetectorRef) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const appRoutes = this.appRoutes$.getValue();
        appRoutes.forEach((route) => {
          route.isActive = false;
        });

        if ( e.url == '/') {
          appRoutes[0].isActive = true;
        } else {
          appRoutes.forEach((route) => {
            const urlSegment = '/' + e.url.split('/')[1];
            route.isActive = e.url == route.path || route.path.startsWith(urlSegment);
          });

        }
        this.appRoutes$.next([...appRoutes]);
      }
    });
  }

  onMemberFound(member: Member) {
    this.router.navigate([`/member/${member.id}`]);
  }


}
