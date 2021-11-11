import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ns-inquiry',
  templateUrl: './inquiry.component.tns.html',
  styleUrls: ['./inquiry.component.tns.scss']
})
export class InquiryComponent implements OnInit {

  @Input('id') id: string;

  constructor() { }

  ngOnInit(): void {
  }

}
