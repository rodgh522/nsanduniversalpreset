import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  sideSize: number = 100;
  constructor() { }

  ngOnInit(): void {
  }

  changeSize(e){
    this.sideSize = e ? 70 : 100;    
  }
  
}
