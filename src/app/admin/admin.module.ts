import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Module */
import { AdminRoutingModule } from '@src/app/admin/admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

/* Component */
import { AdminComponent } from '@src/app/admin/admin.component';
import { MainComponent } from '@src/app/admin/main/main.component';
import { HeaderComponent } from '@src/app/admin/layout/header/header.component';
import { FooterComponent } from '@src/app/admin/layout/footer/footer.component';
import { SidebarComponent } from '@src/app/admin/layout/sidebar/sidebar.component';
import { ReservationComponent } from '@src/app/admin/reservation/reservation.component';
import { UnitComponent } from '@src/app/admin/unit/unit.component';
import { StockComponent } from '@src/app/admin/stock/stock.component';
import { ProfileComponent } from '@src/app/admin/info/profile/profile.component';
import { MypageComponent } from '@src/app/admin/info/mypage/mypage.component';

@NgModule({
  declarations: [
    AdminComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ReservationComponent,
    UnitComponent,
    StockComponent,
    ProfileComponent,
    MypageComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule, FormsModule, ReactiveFormsModule,
    AngularSplitModule,
    MatTooltipModule, MatTabsModule, MatExpansionModule, MatButtonModule
  ]
})
export class AdminModule { }
