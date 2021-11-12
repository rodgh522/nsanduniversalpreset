import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { rootScope } from '../global/global';
import { MobileToastService } from '../service/mobile-toast.service.tns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.tns.html',
  styleUrls: ['./home.component.tns.scss'],
})
export class HomeComponent implements OnInit {
  title = 'movila';

  toast = {
    status: 'hide',
    msg: ''
  };

  constructor(
    public vcr: ViewContainerRef,
    private toastService: MobileToastService
  ) { 
    rootScope.vcRef = this.vcr;
    this.toastService.msg.subscribe(res=> {
      if(res !== '') {
        this.toast.status = 'hide';
        this.toast.msg = res;
        setTimeout(()=> {
          this.toast.status = 'show';
        }, 100);
      }
    })
  }

  ngOnInit() {
    registerElement('Carousel', ()=> Carousel);
    registerElement('CarouselItem', ()=> CarouselItem);
  }
  
}
