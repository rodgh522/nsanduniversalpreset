import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';

/* Module */

/* Component */
import { HomeComponent } from './home.component.tns';
import { FooterComponent } from './layout/footer/footer.component.tns';
import { LoginComponent } from './login/login.component.tns';
import { MainComponent } from './main/main.component.tns';
import { HomeRoutingModule } from './home-routing.module.tns';
import { UnitListComponent } from './unit-list/unit-list.component.tns';
import { AccomListComponent } from './accom-list/accom-list.component.tns';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    MainComponent,
    FooterComponent,
    UnitListComponent,
    AccomListComponent
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
