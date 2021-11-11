import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalDialogParams, registerElement } from '@nativescript/angular';
import { GridLayout, ItemSpec } from '@nativescript/core';
import { Carousel } from 'nativescript-carousel';
import { ModalStack, overrideModalViewMethod } from 'nativescript-windowed-modal';

@Component({
  selector: 'ns-img-viewer',
  templateUrl: './img-viewer.component.tns.html',
  styleUrls: ['./img-viewer.component.tns.scss']
})
export class ImgViewerComponent implements OnInit {
  
  @ViewChild('carousel') carousel: ElementRef<Carousel>;
  @ViewChildren('box') box: QueryList<any>;
  files = [];
  deletable;

  constructor(
    private modalRef: ModalDialogParams
  ) { 
    this.files = this.modalRef.context.files;
    this.deletable = this.modalRef.context.deletable;

    overrideModalViewMethod();
    registerElement('ModalStack', ()=> ModalStack);
  }

  ngOnInit(): void {
  }

  onSwipe(e) {
  }

  deleteFile(idx){
    if(this.files.length > 1) {
      const view = this.box.get(idx).nativeElement;
      this.carousel.nativeElement.removeChild(view);
      this.files.splice(idx, 1);
      this.carousel.nativeElement.refresh();
    }else{
      this.modalRef.closeCallback({
        delete: true
      });
    }
  }

  close() {
    this.modalRef.closeCallback();
  }

}
