import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Module */
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SwiperModule } from 'swiper/angular';

/* Pipe */
import { FilesizePipe } from '@src/app/pipe/filesize.pipe';

/* Directive */
import { FileDropZoneDirective } from '@src/app/directive/file-drop-zone.directive';

/* Component */
import { FileAttachComponent } from '@src/app/shared/file-attach/file-attach.component';
import { AlertComponent } from '@src/app/shared/alert/alert.component';
import { HttpClient } from '@angular/common/http';
import { ImgSingleComponent } from '@src/app/shared/img-single/img-single.component';
import { ImgMultiComponent } from '@src/app/shared/img-multi/img-multi.component';
import { SwiperComponent } from '@src/app/shared/swiper/swiper.component';
import { ImgViewerComponent } from '@src/app/shared/modal/img-viewer/img-viewer.component';
import { ConfirmComponent } from '@src/app/shared/modal/confirm/confirm.component';
import { DatePickerComponent } from '@src/app/shared/mobile/date-picker/date-picker.component';
import { ImgAttachComponent } from '@src/app/shared/img-attach/img-attach.component';

export function createTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    FileAttachComponent,
    AlertComponent, FileDropZoneDirective, FilesizePipe, ImgSingleComponent, ImgMultiComponent, SwiperComponent, ImgViewerComponent, 
    ConfirmComponent, DatePickerComponent, ImgAttachComponent, 
  ],
  imports: [
    CommonModule, 
    MatButtonModule, DragDropModule, SwiperModule,

    TranslateModule.forRoot({
      loader : {
        provide : TranslateLoader,
        useFactory : (createTranslateLoader),
        deps : [HttpClient]
      }
    }),
  ],
  exports: [
    /* Module */
    DragDropModule,

    /* Pipe */
    FilesizePipe,

    /* Component */
    AlertComponent, FileAttachComponent, ImgSingleComponent, ImgMultiComponent, ImgAttachComponent,
    SwiperComponent
  ]
})
export class SharedModule { }
