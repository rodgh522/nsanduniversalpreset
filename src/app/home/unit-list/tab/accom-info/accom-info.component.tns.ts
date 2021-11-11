import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ns-accom-info',
  templateUrl: './accom-info.component.tns.html',
  styleUrls: ['./accom-info.component.tns.scss']
})
export class AccomInfoComponent implements OnInit {

  @Input('id') id: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
