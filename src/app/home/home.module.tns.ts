import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { LoginComponent } from '@src/app/home/login/login.component';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
