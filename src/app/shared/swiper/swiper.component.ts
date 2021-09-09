import { Component, OnInit } from '@angular/core';
import { SwiperComponent as SC } from "swiper/angular";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Thumbs } from 'swiper/core';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Thumbs]);
@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperComponent implements OnInit {

  thumbsSwiper: any;

  constructor() { }

  ngOnInit(): void {
  }

  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }

}
