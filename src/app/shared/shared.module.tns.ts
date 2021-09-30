import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { ImgViewerComponent } from '@src/app/shared/modal/img-viewer/img-viewer.component';
import { ConfirmComponent } from '@src/app/shared/modal/confirm/confirm.component';

@NgModule({
  declarations: [
  
    ImgViewerComponent,
       ConfirmComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }