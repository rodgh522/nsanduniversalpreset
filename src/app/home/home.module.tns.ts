import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';

/* Module */

/* Component */
import { HomeComponent } from '@src/app/home/home.component.tns';
import { FooterComponent } from '@src/app/home/layout/footer/footer.component.tns';
import { LoginComponent } from '@src/app/home/login/login.component.tns';
import { MainComponent } from '@src/app/home/main/main.component.tns';
import { HomeRoutingModule } from '@src/app/home/home-routing.module.tns';
import { UnitListComponent } from '@src/app/home/unit-list/unit-list.component.tns';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    MainComponent,
    FooterComponent,
    UnitListComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    HomeRoutingModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
