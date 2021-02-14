import {Component, OnInit} from '@angular/core';
import {Member} from './models/member.model';
import {Router} from '@angular/router';


interface AppRoute {
  label: string;
  path: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  appRoutes: AppRoute[] = [{label: 'Schedules', path: '/classes/schedules'},
                           {label: 'Members', path: '/members'},
                           ];
  title = 'primal-accounting';

  constructor(private router: Router) {
  }

  onMemberFound(member: Member) {
    this.router.navigate([`/member/${member.id}`]);
  }


}
