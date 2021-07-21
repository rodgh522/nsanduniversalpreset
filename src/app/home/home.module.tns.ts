import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { LoginComponent } from '@src/app/home/login/login.component.tns';
import { HomeComponent } from '@src/app/home/home.component.tns';
import { MainComponent } from '@src/app/home/main/main.component.tns';
import { HomeRoutingModule } from '@src/app/home/home-routing.module.tns';

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
