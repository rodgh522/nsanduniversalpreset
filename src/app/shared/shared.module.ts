import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Module */
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatButtonModule } from '@angular/material/button';

/* Pipe */
import { FilesizePipe } from '@src/app/pipe/filesize.pipe';

/* Directive */
import { FileDropZoneDirective } from '@src/app/directive/file-drop-zone.directive';

/* Component */
import { FileAttachComponent } from '@src/app/shared/file-attach/file-attach.component';
import { AlertComponent } from '@src/app/shared/alert/alert.component';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    FileAttachComponent,
    AlertComponent, FileDropZoneDirective, FilesizePipe
  ],
  imports: [
    CommonModule, 
    MatButtonModule,


    TranslateModule.forRoot({
      loader : {
        provide : TranslateLoader,
        useFactory : (createTranslateLoader),
        deps : [HttpClient]
      }
    }),
  ],
  exports: [
    FileAttachComponent,
    AlertComponent, FilesizePipe
  ]
})
export class SharedModule { }
