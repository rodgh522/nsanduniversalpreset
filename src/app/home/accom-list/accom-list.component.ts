import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerToggle, MatDateRangeInput } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { PostApiService } from '@src/app/service/post-api.service';

@Component({
  selector: 'app-accom-list',
  templateUrl: './accom-list.component.html',
  styleUrls: ['./accom-list.component.scss']
})
export class AccomListComponent implements OnInit {

  @ViewChild('matDateToggle') matDateToggle: MatDatepickerToggle<Date>;
  @ViewChild('rangeInput') rangeInput: MatDateRangeInput<Date>;
  
  srch: any = {};
  areaToggle = false;
  guestToggle = false;
  areaText = '전국';
  today = new Date();
  maxDay;
  startDate;
  endDate;

  constructor(
    private activateRouter: ActivatedRoute,
    private postApi: PostApiService
  ) { 
    this.srch = this.activateRouter.snapshot.queryParams;
    this.srch.dates.map(function(a){
      a = new Date(a);
      return a;
    });
    this.maxDay = new Date(Date.parse(this.today.toString()) + 30 * 1000 * 60 * 60 * 24);
  }

  ngOnInit(): void {
    console.log(this.srch);

    this.startDate = this.srch.dates[0];
    this.endDate = new Date(Date.parse(new Date(this.srch.dates[this.srch.dates.length - 1]).toString()) + 1000 * 60 * 60 * 24);
    
    this.getList();
  }
  
  getList(){
    let param = {
      ...this.srch,
      mapcode: 'MovilaSearch.getAccomList',
      uploadFileList: [],
      tableNm: 'accom',
      IdName: 'AcomId',
      dates: this.changeFormat(this.srch.dates)
    };
    this.postApi.movilaSelect(param, (res)=> {
      console.log(res);
    });
  }

  changeFormat(list){
    const result = list.map((a)=> {
      var date = new Date(a);
      return {
        bookingDt: date.toStrFormat(),
        bookingDay: date.getDay()
      };
    });
    return result;
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
    this.srch.dates = [];
    if (!endDt) {
      return;
    } 
    let target = beginDt;
    while (target < endDt) {
      this.srch.dates.push(target);
      target = new Date(Date.parse(target.toString()) + 1000 * 60 * 60 * 24);
    }
    this.srch.straight = this.srch.dates.length;
  }
  
}
