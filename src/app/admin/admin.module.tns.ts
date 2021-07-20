import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AdminComponent } from '@src/app/admin/admin.component';
import { MainComponent } from '@src/app/admin/main/main.component';
import { HeaderComponent } from '@src/app/admin/layout/header/header.component';
import { FooterComponent } from '@src/app/admin/layout/footer/footer.component';



@NgModule({
  declarations: [
    AdminComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AdminModule { }
