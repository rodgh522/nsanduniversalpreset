import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AccomListComponent } from './accom-list/accom-list.component.tns';
import { HomeComponent } from './home.component.tns';
import { LoginComponent } from './login/login.component.tns';
import { MainComponent } from './main/main.component.tns';
import { CompleteComponent } from './payment/complete/complete.component.tns';
import { PaymentComponent } from './payment/payment.component.tns';
import { InfoComponent } from './personal/mypage/info/info.component.tns';
import { MybookingDetailComponent } from './personal/mypage/mybooking/mybooking-detail.component.tns';
import { MybookingComponent } from './personal/mypage/mybooking/mybooking.component.tns';
import { MypageComponent } from './personal/mypage/mypage.component.tns';
import { UnitListComponent } from './unit-list/unit-list.component.tns';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', component: HomeComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'accom', component: AccomListComponent },
      { path: 'unit/:acomId', component: UnitListComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'login', component: LoginComponent},
      { path: 'mypage', component: MypageComponent },
      { path: 'info', component: InfoComponent },
      { path: 'booking', component: MybookingComponent },
      { path: 'reservation/:param', component: MybookingDetailComponent },
      { path: 'complete/:param', component: CompleteComponent },
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule, NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
