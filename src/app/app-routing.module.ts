import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [{path: '', loadChildren: () => import('./classes/classes.module').then(m => m.ClassesModule)},
  {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  {
    path: 'members', loadChildren: () => import('./members/members.module').then(m => m.MembersModule),
  },
  {
    path: 'classes', loadChildren: () => import('./classes/classes.module').then(m => m.ClassesModule),
  },
  {
    path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
