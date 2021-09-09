import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.tns.html',
  styleUrls: ['./unit-list.component.tns.scss']
})
export class UnitListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('unit');
  }

}
