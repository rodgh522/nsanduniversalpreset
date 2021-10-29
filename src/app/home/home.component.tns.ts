import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { rootScope } from '../global/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.tns.html',
  styleUrls: ['./home.component.tns.scss'],
})
export class HomeComponent implements OnInit {
  title = 'movila';

  constructor(
    public vcr: ViewContainerRef
  ) { 
    rootScope.vcRef = this.vcr;
  }

  ngOnInit() {
    registerElement('Carousel', ()=> Carousel);
    registerElement('CarouselItem', ()=> CarouselItem);
  }
  
}
