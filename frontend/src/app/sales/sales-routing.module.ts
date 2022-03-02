import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InventoryListComponent} from './invetory/inventory-list/inventory-list.component';

const routes: Routes = [
  {path: '', component: InventoryListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {
}
