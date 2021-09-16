import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerToggle, MatDateRangeInput } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('matDateToggle') matDateToggle: MatDatepickerToggle<Date>;
  @ViewChild('rangeInput') rangeInput: MatDateRangeInput<Date>;
  srch: any = {
    Sido: [],
    guest: 2
  };
  areaToggle = false;
  guestToggle = false;
  areaText = '전국';
  today = new Date();
  maxDay;
  startDate = this.today;
  endDate;

  subscription: Array<Subscription> = [];
  constructor(
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats
  ) { 
    this.maxDay = new Date(Date.parse(this.today.toString()) + 30 * 1000 * 60 * 60 * 24);
    this.endDate = new Date(Date.parse(this.today.toString()) + 1000 * 60 * 60 * 24);
  }
  
  ngOnInit(): void {
    this.setDate(this.startDate, this.endDate);
  }
  
  ngAfterViewInit(){
  }
  
  ngOnDestroy(){
    this.subscription.forEach((a)=> a.unsubscribe());
  }
  
  openDatePicker(){
    this.rangeInput._openDatepicker();
  }

  finishedPickDate(){
    const date = this.rangeInput.value;
    this.setDate(date.start, date.end);
    if (date.start) {
      this.startDate = date.start;
    }
    if (date.end) {
      this.endDate = date.end;
    }
  }

  setArea(e){
    this.areaText = e.path[0].innerText; 
    this.srch.Sido = this.areaText != '전국' ? this.areaText.split('/') : [];
    this.areaToggle = false;
  }
  
  setDate(beginDt: Date, endDt: Date){
    this.srch.date = [];
    // this.srch.BeginDt = beginDt ? beginDt.toStrFormat() : undefined;
    // this.srch.EndDt = endDt ? endDt.toStrFormat() : undefined;
    if (!endDt) {
      return;
    } 
    let target = beginDt;
    while (target < endDt) {
      const temp = {
        date: target,
        day: target.getDay()
      };
      this.srch.date.push(temp);
      target = new Date(Date.parse(target.toString()) + 1000 * 60 * 60 * 24);
    }
  }
  
  srchList(){
    console.log(this.srch);
  }
}
