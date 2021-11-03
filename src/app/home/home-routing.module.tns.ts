import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AccomListComponent } from './accom-list/accom-list.component.tns';
import { HomeComponent } from './home.component.tns';
import { LoginComponent } from './login/login.component.tns';
import { MainComponent } from './main/main.component.tns';
import { PaymentComponent } from './payment/payment.component.tns';
import { UnitListComponent } from './unit-list/unit-list.component.tns';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '', component: HomeComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'accom', component: AccomListComponent },
      { path: 'unit/:acomId', component: UnitListComponent },
      { path: 'payment', component: PaymentComponent },
    ]
  },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [NativeScriptRouterModule, NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
