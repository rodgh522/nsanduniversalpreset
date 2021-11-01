import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'ns-rerender',
  templateUrl: './rerender.component.tns.html',
  styleUrls: ['./rerender.component.tns.scss']
})
export class RerenderComponent implements OnInit {

  constructor(
    private modalRef: ModalDialogParams
  ) { }

  ngOnInit(): void {
    this.modalRef.closeCallback();
  }

}
