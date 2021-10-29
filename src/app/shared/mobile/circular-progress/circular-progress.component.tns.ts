import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'ns-circular-progress',
  templateUrl: './circular-progress.component.tns.html',
  styleUrls: ['./circular-progress.component.tns.scss']
})
export class CircularProgressComponent implements OnInit, OnChanges {

  progress = 0;
  interval;
  @Input('doStop') doStop: boolean;
  constructor() { }

  ngOnInit(): void {
    this.scaling();
  }

  ngOnChanges(changes){
    console.log(changes);
    if(changes.currentValue == false) {
      clearInterval(this.interval);
    } 
  }

  scaling(){
    this.progress = 100;
    this.interval = setInterval(()=> {
      this.progress = 0;
      setTimeout(()=>{
        this.progress = 100;
      }, 1000);
    }, 2000);
  }

  change(){
    this.progress = Math.floor(Math.random() * 100);
    console.log(this.progress);
  }
}
