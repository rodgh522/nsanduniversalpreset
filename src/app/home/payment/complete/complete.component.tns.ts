import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-complete',
  templateUrl: './complete.component.tns.html',
  styleUrls: ['./complete.component.tns.scss']
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
