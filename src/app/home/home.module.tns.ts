import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';

/* Module */
import { SharedModule } from '@src/app/shared/shared.module.tns';
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';

/* Component */
import { HomeComponent } from '@src/app/home/home.component.tns';
import { FooterComponent } from '@src/app/home/layout/footer/footer.component.tns';
import { LoginComponent } from '@src/app/home/login/login.component.tns';
import { MainComponent } from '@src/app/home/main/main.component.tns';
import { HomeRoutingModule } from '@src/app/home/home-routing.module.tns';
import { UnitListComponent } from '@src/app/home/unit-list/unit-list.component.tns';
import { AccomListComponent } from '@src/app/home/accom-list/accom-list.component.tns';
import { PaymentComponent } from '@src/app/home/payment/payment.component.tns';
import { CompleteComponent } from '@src/app/home/payment/complete/complete.component.tns';
import { MypageComponent } from '@src/app/home/personal/mypage/mypage.component.tns';
import { InfoComponent } from '@src/app/home/personal/mypage/info/info.component.tns';
import { MybookingComponent } from '@src/app/home/personal/mypage/mybooking/mybooking.component.tns';
import { MybookingDetailComponent } from '@src/app/home/personal/mypage/mybooking/mybooking-detail.component.tns';

/* Pipe */
import { SidoPipe } from '@src/app/pipe/sido.pipe';
import { CommaPipe } from '@src/app/pipe/comma.pipe';
import { SubstrPipe } from '@src/app/pipe/substr.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    MainComponent,
    FooterComponent,
    UnitListComponent,
    AccomListComponent, PaymentComponent, CompleteComponent, MypageComponent,
    InfoComponent, MybookingComponent, MybookingDetailComponent, 
    
    // Pipe
    SidoPipe, CommaPipe, SubstrPipe,
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
