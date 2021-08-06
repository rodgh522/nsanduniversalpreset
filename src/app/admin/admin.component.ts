import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { rootScope } from '../global/global';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  @ViewChild('wrapper') wrapper: ElementRef;
  container: number;
  sideSize = 0;
  constructor(
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(){
    setTimeout(()=> {
      this.container = rootScope.windowSize.outerWidth = this.wrapper.nativeElement.offsetWidth;
      this.setView();
    }, 1)
  }

  @HostListener('window:resize')
  react(){
    this.container = rootScope.windowSize.outerWidth = window.outerWidth;
    this.setView();
  }

  changeSize(e){
    this.sideSize = e ? 70 : 100;    
  }
  
  setView(){
    if(this.container < 500){
      this.sideSize = 0;
    }else{
      this.sideSize = 100;
    }
  }
}
