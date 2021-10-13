import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {

  data: any;
  constructor(
    private activateRoute: ActivatedRoute
  ) { 
    this.data = JSON.parse(this.activateRoute.snapshot.params.param);
  }

  ngOnInit(): void {
  }

}
