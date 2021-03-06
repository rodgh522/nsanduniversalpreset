import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { JoinComponent } from './login/join/join.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
      children: [
        { path: '', redirectTo: 'main', pathMatch: ''},
        { path: 'main', component: MainComponent }
      ]},
  { path: 'login', component: LoginComponent },
  { path: 'join', component: JoinComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
