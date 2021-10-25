import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { SearchBoxComponent } from '@src/app/shared/mobile/search-box/search-box.component.tns';
import { SetGuestsComponent } from '@src/app/shared/mobile/set-guests/set-guests.component';
import { DatePickerComponent } from '@src/app/shared/mobile/date-picker/date-picker.component';
import { CustomdatePipe } from '../pipe/customdate.pipe';

/* Module */
@NgModule({
  declarations: [
    SearchBoxComponent,
    SetGuestsComponent,
    DatePickerComponent,
    CustomdatePipe
  ],
  imports: [
    NativeScriptCommonModule
  ],
  exports: [
    SearchBoxComponent,
    CustomdatePipe
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }