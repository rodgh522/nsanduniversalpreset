import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { StaticVariableService } from '@src/app/global/static-variable';
import { SwiperComponent as SC } from "swiper/angular";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Thumbs } from 'swiper/core';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Thumbs]);
@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperComponent implements OnInit, OnChanges {

  @Input('imageHeight') mainHeight: string;
  @Input('thumbHeight') thumbHeight: string;
  @Input('images') images: Array<any>;
  
  thumbsSwiper: any;

  constructor(
    private staticVariable: StaticVariableService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.images && this.images.length > 0) {
      this.images.map(a=> a.link = this.staticVariable.getFileDownloadUrl(a.PhysicalFileNm));
    }
  }

  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }

}
