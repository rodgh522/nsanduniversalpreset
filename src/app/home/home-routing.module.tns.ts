import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { HomeComponent } from './home.component.tns';
import { LoginComponent } from './login/login.component.tns';
import { MainComponent } from './main/main.component.tns';
import { UnitListComponent } from './unit-list/unit-list.component.tns';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '', component: HomeComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'unit', component: UnitListComponent },
    ]
  },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [NativeScriptRouterModule, NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
