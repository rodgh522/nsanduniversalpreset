import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';

/* Module */
import { SharedModule } from '../shared/shared.module.tns';
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';

/* Component */
import { HomeComponent } from './home.component.tns';
import { FooterComponent } from './layout/footer/footer.component.tns';
import { LoginComponent } from './login/login.component.tns';
import { MainComponent } from './main/main.component.tns';
import { HomeRoutingModule } from './home-routing.module.tns';
import { UnitListComponent } from './unit-list/unit-list.component.tns';
import { AccomListComponent } from './accom-list/accom-list.component.tns';
import { PaymentComponent } from './payment/payment.component.tns';

/* Pipe */
import { SidoPipe } from '@src/app/pipe/sido.pipe';
import { CommaPipe } from '@src/app/pipe/comma.pipe';
import { SubstrPipe } from '../pipe/substr.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    MainComponent,
    FooterComponent,
    UnitListComponent,
    AccomListComponent, PaymentComponent, 

    // Pipe
    SidoPipe, CommaPipe, SubstrPipe
  ],
  imports: [
    NativeScriptCommonModule, NativeScriptFormsModule,
    HomeRoutingModule,
    SharedModule, TNSCheckBoxModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
