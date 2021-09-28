import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerToggle, MatDateRangeInput } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { rootScope } from '@src/app/global/global';
import { StaticVariableService } from '@src/app/global/static-variable';
import { PostApiService } from '@src/app/service/post-api.service';
import { SearchService } from '@src/app/service/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accom-list',
  templateUrl: './accom-list.component.html',
  styleUrls: ['./accom-list.component.scss']
})
export class AccomListComponent implements OnInit, OnDestroy {

  @ViewChild('matDateToggle') matDateToggle: MatDatepickerToggle<Date>;
  @ViewChild('rangeInput') rangeInput: MatDateRangeInput<Date>;

  subscription: Array<Subscription> = [];
  
  dataloader = false;
  srch: any = {};
  areaToggle = false;
  guestToggle = false;
  areaText = '전국';
  today = new Date();
  maxDay;
  startDate;
  endDate;
  list = [];
  recommandList = [];

  constructor(
    private postApi: PostApiService,
    private searchService: SearchService,
    private staticVariable: StaticVariableService,
    private router: Router
  ) { 
    this.maxDay = new Date(Date.parse(this.today.toString()) + 30 * 1000 * 60 * 60 * 24);

    this.subscription.push(this.searchService.searchList.subscribe((res)=> {
      this.srch = res;
    }));
  }

  ngOnInit(): void {
    if(rootScope.isWeb) {
      this.startDate = this.srch.dates[0];
      this.endDate = new Date(Date.parse(this.srch.dates[this.srch.dates.length - 1].toString()) + 1000 * 60 * 60 * 24);
      this.areaText = this.srch.Sido.length > 0 ? this.arrToStr(this.srch.Sido): '전국';
      
      this.getList();
    }
  }

  ngOnDestroy(){
    this.subscription.forEach(a=> a.unsubscribe());
  }

  arrToStr(arr){
    let result = '';
    arr.forEach(a=> result += result == '' ? a : '/' + a);
    return result;
  }

  getList(){
    this.dataloader = true;
    this.searchService.setSearchList(this.srch);

    let param = {
      ...this.srch,
      mapcode: 'MovilaSearch.getAccomList',
      uploadFileList: [],
      tableNm: 'accom',
      IdName: 'AcomId',
      dates: this.changeFormat(this.srch.dates)
    };
    
    this.postApi.movilaSelect(param, (res)=> {
      if(res.header.status === 200) {
        this.dataloader = false;
        this.list = res.body.docs.map((a)=> {
          if(a.uploadFileList.length > 0) {
            a.link = this.staticVariable.getFileDownloadUrl(a.uploadFileList[0].PhysicalFileNm)
          } else {
            a.link = 'assets/images/no_image.jpg'
          }
          return a;
        });
        this.recommandList = this.list.slice(0, 3);
      }
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

  goDetail(keyId: string){
    const data = {
      AcomId: keyId,
      dates: this.srch.dates,
      GuestMax: this.srch.GuestMax
    };
    this.searchService.setSearchDetail(data);
    this.router.navigateByUrl('/unit');
  }
  
}
