import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular';

import { AppRoutingModule } from '@src/app/app-routing.module.tns';
import { AppComponent } from '@src/app/app.component.tns';
import { SidebarComponent } from '@src/app/admin/layout/sidebar/sidebar.component';
import { ReservationComponent } from '@src/app/admin/reservation/reservation.component';
import { UnitComponent } from '@src/app/admin/unit/unit.component';
import { StockComponent } from '@src/app/admin/stock/stock.component';
import { ProfileComponent } from '@src/app/admin/info/profile/profile.component';
import { MypageComponent } from '@src/app/admin/info/mypage/mypage.component';
import { AddComponent } from '@src/app/admin/unit/add/add.component';


// Uncomment and add to NgModule imports if you need to use two-way binding and/or HTTP wrapper
// import { NativeScriptFormsModule, NativeScriptHttpClientModule } from '@nativescript/angular';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ReservationComponent,
    UnitComponent,
    StockComponent,
    ProfileComponent,
    MypageComponent,
    AddComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
