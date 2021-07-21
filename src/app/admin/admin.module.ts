import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Module */
import { AdminRoutingModule } from '@src/app/admin/admin-routing.module';
import { AngularSplitModule } from 'angular-split';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

/* Component */
import { AdminComponent } from '@src/app/admin/admin.component';
import { MainComponent } from '@src/app/admin/main/main.component';
import { HeaderComponent } from '@src/app/admin/layout/header/header.component';
import { FooterComponent } from '@src/app/admin/layout/footer/footer.component';
import { SidebarComponent } from '@src/app/admin/layout/sidebar/sidebar.component';
import { ReservationComponent } from '@src/app/admin/reservation/reservation.component';
import { UnitComponent } from '@src/app/admin/unit/unit.component';
import { StockComponent } from '@src/app/admin/stock/stock.component';

@NgModule({
  declarations: [
    AdminComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ReservationComponent,
    UnitComponent,
    StockComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularSplitModule,
    MatTooltipModule, MatTabsModule
  ]
})
export class AdminModule { }
