import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { MainComponent } from './main/main.component';
import { ReservationComponent } from './reservation/reservation.component';
import { StockComponent } from './stock/stock.component';
import { UnitComponent } from './unit/unit.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children: [
      { path: 'main', component: MainComponent},
      { path: 'reserve', component: ReservationComponent},
      { path: 'unit', component: UnitComponent},
      { path: 'stock', component: StockComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
