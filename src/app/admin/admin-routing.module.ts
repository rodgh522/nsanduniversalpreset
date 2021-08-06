import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { MypageComponent } from './info/mypage/mypage.component';
import { MainComponent } from './main/main.component';
import { ReservationComponent } from './reservation/reservation.component';
import { StockComponent } from './stock/stock.component';
import { AccomComponent } from './accom/accom.component';
import { ListComponent } from './accom/unit/list/list.component';
import { EditComponent } from './accom/unit/edit/edit.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children: [
      { path: 'main', component: MainComponent},
      { path: 'reserve', component: ReservationComponent},
      { path: 'accom', component: AccomComponent,
        children: [
          { path: '', redirectTo: 'unit-list' },
          { path: 'unit-list', component: ListComponent },
          { path: 'unit-edit', component: EditComponent },
          { path: 'unit-edit/:keyId', component: EditComponent },
        ]
      },
      { path: 'stock', component: StockComponent},
      { path: 'mypage', component: MypageComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
