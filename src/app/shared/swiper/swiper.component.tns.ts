import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StaticVariableService } from '@src/app/global/static-variable';
import { Carousel } from 'nativescript-carousel';

@Component({
  selector: 'ns-swiper',
  templateUrl: './swiper.component.tns.html',
  styleUrls: ['./swiper.component.tns.scss']
})
export class SwiperComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input('imageHeight') mainHeight: string;
  @Input('thumbHeight') thumbHeight: string;
  @Input('images') images: Array<any>;
  @Input('fileType') fileType: string;
  @ViewChild('carousel') carousel: ElementRef<Carousel>;
  
  constructor(
    private staticVariable: StaticVariableService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    // initialize carousel
  }
  
  ngOnChanges(){
    if(this.images && this.images.length > 0) {
      setTimeout(()=> {
        this.carousel.nativeElement.refresh();
      }, 500);
      if(this.fileType !== 'temp') {
        this.images.map(a=> a.link = this.staticVariable.getFileDownloadUrl(a.PhysicalFileNm));
      }
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(){
  }

  onSwipe(e) {
  }

}
