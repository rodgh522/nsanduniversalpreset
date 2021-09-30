import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Module */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from '@src/app/home/home-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

/* Component */
import { HomeComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/home/login/login.component';
import { HeaderComponent } from '@src/app/home/layout/header/header.component';
import { FooterComponent } from '@src/app/home/layout/footer/footer.component';
import { MainComponent } from '@src/app/home/main/main.component';
import { JoinComponent } from '@src/app/home/login/join/join.component';
import { UnitListComponent } from '@src/app/home/unit-list/unit-list.component';

/* Pipe */
import { CustomdatePipe } from '@src/app/pipe/customdate.pipe';
import { AccomListComponent } from '@src/app/home/accom-list/accom-list.component';
import { SidoPipe } from '@src/app/pipe/sido.pipe';
import { CommaPipe } from '@src/app/pipe/comma.pipe';
import { PaymentComponent } from '@src/app/home/payment/payment.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    HeaderComponent, FooterComponent, MainComponent, JoinComponent, UnitListComponent,

    /* pipe */
    CustomdatePipe,
    AccomListComponent, SidoPipe, CommaPipe, PaymentComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, ReactiveFormsModule,
    MatCheckboxModule, MatTooltipModule, SharedModule,
    MatDatepickerModule, MatProgressSpinnerModule, MatButtonModule
  ]
})
export class HomeModule { }
