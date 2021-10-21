import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular';

import { AppRoutingModule } from './app-routing.module.tns';
import { AppComponent } from './app.component.tns';

/* HTTP */
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Uncomment and add to NgModule imports if you need to use two-way binding and/or HTTP wrapper
// import { NativeScriptFormsModule, NativeScriptHttpClientModule } from '@nativescript/angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
