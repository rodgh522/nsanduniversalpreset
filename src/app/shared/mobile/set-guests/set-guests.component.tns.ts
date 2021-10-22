import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'ns-set-guests',
  templateUrl: './set-guests.component.tns.html',
  styleUrls: ['./set-guests.component.tns.scss']
})
export class SetGuestsComponent implements OnInit {

  dateRange;
  guest = 2;
  
  constructor(
    private modalRef: ModalDialogParams
  ) { }

  ngOnInit(): void {
    this.guest = this.modalRef.context;
  }

  count(add){
    if(add < 0 && this.guest === 2) {
      return;
    }
    this.guest += add;
  }

  close(action){    // 0: cancle, 1: adjust
    action === 0 ?
      this.modalRef.closeCallback()
      : this.modalRef.closeCallback(this.guest)
  }
}
