import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AlertComponent } from '@src/app/shared/alert/alert.component';



@NgModule({
  declarations: [
  
    AlertComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
