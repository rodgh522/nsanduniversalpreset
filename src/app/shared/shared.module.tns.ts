import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AlertComponent } from '@src/app/shared/alert/alert.component';
import { ImgSingleComponent } from '@src/app/shared/img-single/img-single.component';
import { ImgMultiComponent } from '@src/app/shared/img-multi/img-multi.component';



@NgModule({
  declarations: [
    AlertComponent,
    ImgSingleComponent,
    ImgMultiComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
