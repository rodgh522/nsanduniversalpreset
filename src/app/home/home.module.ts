import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Module */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from '@src/app/home/home-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@src/app/shared/shared.module';

/* Component */
import { HomeComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/home/login/login.component';
import { HeaderComponent } from '@src/app/home/layout/header/header.component';
import { FooterComponent } from '@src/app/home/layout/footer/footer.component';
import { MainComponent } from '@src/app/home/main/main.component';
import { JoinComponent } from '@src/app/home/login/join/join.component';
import { UnitListComponent } from '@src/app/home/unit-list/unit-list.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    HeaderComponent, FooterComponent, MainComponent, JoinComponent, UnitListComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, ReactiveFormsModule,
    MatCheckboxModule, MatTooltipModule, SharedModule
  ]
})
export class HomeModule { }
