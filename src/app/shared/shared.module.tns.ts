import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
// Module
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';

// Component
import { SearchBoxComponent } from '@src/app/shared/mobile/search-box/search-box.component.tns';
import { SetGuestsComponent } from '@src/app/shared/mobile/set-guests/set-guests.component';
import { DatePickerComponent } from '@src/app/shared/mobile/date-picker/date-picker.component';
import { CircularProgressComponent } from '@src/app/shared/mobile/circular-progress/circular-progress.component.tns';
import { SwiperComponent } from '@src/app/shared/swiper/swiper.component.tns';

// Pipe
import { CustomdatePipe } from '@src/app/pipe/customdate.pipe';
import { RerenderComponent } from '@src/app/shared/mobile/rerender/rerender.component.tns';

/* Module */
@NgModule({
  declarations: [
    SearchBoxComponent,
    SetGuestsComponent,
    DatePickerComponent,
    CustomdatePipe,
    CircularProgressComponent, SwiperComponent, RerenderComponent
  ],
  imports: [
    NativeScriptCommonModule, NativeScriptUIGaugeModule
  ],
  exports: [
    SearchBoxComponent,
    CustomdatePipe, CircularProgressComponent, SwiperComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }