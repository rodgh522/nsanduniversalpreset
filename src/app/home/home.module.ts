import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from '@src/app/home/home-routing.module';
import { HomeComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/home/login/login.component';
import { HeaderComponent } from '@src/app/home/layout/header/header.component';
import { FooterComponent } from '@src/app/home/layout/footer/footer.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    HeaderComponent, FooterComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
