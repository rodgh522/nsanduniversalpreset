import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { JoinComponent } from './login/join/join.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AccomListComponent } from './accom-list/accom-list.component';
import { UnitListComponent } from './unit-list/unit-list.component';
import { PaymentComponent } from './payment/payment.component';
import { CompleteComponent } from './payment/complete/complete.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
      children: [
        { path: '', redirectTo: 'main', pathMatch: ''},
        { path: 'main', component: MainComponent },
        { path: 'accom', component: AccomListComponent },
        { path: 'unit/:param', component: UnitListComponent },
        { path: 'payment', component: PaymentComponent },
        { path: 'complete/:param', component: CompleteComponent },
      ]},
  { path: 'login', component: LoginComponent },
  { path: 'join', component: JoinComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
