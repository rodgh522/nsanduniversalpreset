import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@src/app/shared/shared.module';

/* Module */
import { AdminRoutingModule } from '@src/app/admin/admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

/* Component */
import { AdminComponent } from '@src/app/admin/admin.component';
import { MainComponent } from '@src/app/admin/main/main.component';
import { HeaderComponent } from '@src/app/admin/layout/header/header.component';
import { FooterComponent } from '@src/app/admin/layout/footer/footer.component';
import { SidebarComponent } from '@src/app/admin/layout/sidebar/sidebar.component';
import { ReservationComponent } from '@src/app/admin/reservation/reservation.component';
import { AccomComponent } from '@src/app/admin/accom/accom.component';
import { StockComponent } from '@src/app/admin/stock/stock.component';
import { ProfileComponent } from '@src/app/admin/info/profile/profile.component';
import { MypageComponent } from '@src/app/admin/info/mypage/mypage.component';
import { AddComponent } from '@src/app/admin/accom/add/add.component';
import { UnitComponent } from '@src/app/admin/accom/unit/unit.component';
import { ListComponent } from '@src/app/admin/accom/unit/list/list.component';
import { EditComponent } from '@src/app/admin/accom/unit/edit/edit.component';

@NgModule({
  declarations: [
    AdminComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ReservationComponent,
    AccomComponent,
    StockComponent,
    ProfileComponent,
    MypageComponent,
    AddComponent,
    UnitComponent,
    ListComponent,
    EditComponent
  ],
  imports: [
    CommonModule, SharedModule,
    AdminRoutingModule, FormsModule, ReactiveFormsModule,
    AngularSplitModule,
    MatTooltipModule, MatTabsModule, MatExpansionModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatChipsModule, MatIconModule,
    MatSelectModule, MatCheckboxModule
  ]
})
export class AdminModule { }
