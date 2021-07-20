import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { LoginComponent } from './login/login.component.tns';
import { HomeComponent } from './home.component.tns';
import { MainComponent } from './main/main.component.tns';
import { HomeRoutingModule } from './home-routing.module.tns';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    MainComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    HomeRoutingModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
