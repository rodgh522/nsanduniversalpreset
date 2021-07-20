import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from '@src/app/admin/admin.component';
import { MainComponent } from '@src/app/admin/main/main.component';
import { HeaderComponent } from '@src/app/admin/layout/header/header.component';
import { FooterComponent } from '@src/app/admin/layout/footer/footer.component';
import { AdminRoutingModule } from './admin-routing.module';



@NgModule({
  declarations: [
    AdminComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
