import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [
    trigger('highlight', [
      state('active', style({color: '#000'})),
      state('deactive', style({color: '#a7a7aa'}))
    ])
  ],
})
export class FooterComponent implements OnInit {

  selected: string;
  constructor() { }

  ngOnInit(): void {
  }

}
