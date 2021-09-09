import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.tns.html',
  styleUrls: ['./home.component.tns.scss'],
})
export class HomeComponent implements OnInit {
  title = 'movila';

  constructor() { }

  ngOnInit() {
    console.log('home component');
  }
  
}
