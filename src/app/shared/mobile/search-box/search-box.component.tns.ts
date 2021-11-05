import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { action, isIOS } from '@nativescript/core';
import { ios } from '@nativescript/core/application';
import { isNullOrEmpty, rootScope } from '@src/app/global/global';
import { SearchService } from '@src/app/service/search.service';
import { create } from 'nativescript-ngx-date-range';
import { Options } from 'nativescript-ngx-date-range/ngx-date-range.common';
import { DatePickerComponent } from '../date-picker/date-picker.component.tns';
import { RerenderComponent } from '../rerender/rerender.component.tns';
import { SetGuestsComponent } from '../set-guests/set-guests.component.tns';
const today = new Date();
declare const UIModalPresentationStyle;
@Component({
  selector: 'ns-search-box',
  templateUrl: './search-box.component.tns.html',
  styleUrls: ['./search-box.component.tns.scss']
})
export class SearchBoxComponent implements OnInit {

  @Output() onSearch = new EventEmitter;
  @ViewChild ('calendar') templateRef: TemplateRef<any>;
  dateRange;
  srch: any = {};
  toggle: any = {};
  area = '전국';
  guest = 2;
  startDate = today;
  endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  isIos = isIOS;

  constructor(
    private modalService: ModalDialogService,
    private vref: ViewContainerRef,
    private router: RouterExtensions,
    private searchService: SearchService
  ) { 
  }
  
  ngOnInit(): void {
    this.srch = this.searchService.srch;
    this.initData();
  }

  initData(){
    this.area = this.srch.Sido.length === 0 ? this.area : this.putTogether();
    this.guest = this.srch.GuestMax;
    this.startDate = this.srch.dates[0];
    this.endDate = new Date(Date.parse(this.srch.dates[this.srch.dates.length - 1].toString()) + 1000 * 60 * 60 * 24);
  }

  putTogether(){
    let result = '';
    this.srch.Sido.forEach((a, idx)=> {
      result += a;
      if(idx < this.srch.Sido.length - 1) {
        result += '/';
      }
    });
    return result;
  }

  searchArea(){
    action('지역선택', '취소', ['전국', '서울/경기/인천', '충북/충남', '경북/대구','제주']).
    then((res)=> {
      this.area = res !== '취소' ? res : this.area;
      this.srch.Sido = this.area.split('/');
      this.srch.Sido = this.srch.Sido[0] === '전국' ? [] : this.srch.Sido;
    });
  }

  setGuests(){
    const config: ModalDialogOptions = {
      viewContainerRef: rootScope.vcRef,
      fullscreen: false,
      context: this.guest
    };
    this.modalService.showModal(SetGuestsComponent, config).
    then((res)=> {
      res ? this.srch.GuestMax = this.guest = res : '';
    });
  }

  openCalendar(){
    if(ios) {
      const options: Options = {
        selectionMode: 'RANGE',
        disablePrevDates: true,
        simpleDateFormat: 'YYYY MMMM',
        selectToday: true,
        language: {
          countryCode: 'KOR',
          languageCode: 'kor',
        },
      };
      this.dateRange = create(options);
      this.dateRange.showDateRangePicker((res)=>{
        this.setDate(res);
        this.rerender();
      });
    }else {
      const config: ModalDialogOptions = {
        viewContainerRef: this.vref,
        fullscreen: false,
      };
      this.modalService.showModal(DatePickerComponent, config).
      then((res)=> {
        if(res) {
          this.setDate(res);
        }
      });
    }
  }

  setDate(range: any){
    if(range.startDate === '') {
      return;
    }

    this.startDate = new Date(range.startDate);
    this.endDate = range.endDate ? new Date(range.endDate) : new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + 1);
    this.makeDateRange();
  }

  makeDateRange(){
    this.srch.dates = [];
    let date = this.startDate;
    while(date < this.endDate) {
      this.srch.dates.push(date);
      date = new Date(Date.parse(date.toString()) + 1000 * 60 * 60 * 24);
    }
    this.srch.straight = this.srch.dates.length;
  }

  getSearch(){
    this.searchService.srch = this.srch;
    this.router.navigateByUrl('accom');
    this.onSearch.emit();
  }

  rerender(){
    const config = {
      viewContainerRef: rootScope.vcRef,
      fullscreen: true,
      dimAmount: 0
    };
    this.modalService.showModal(RerenderComponent, config);
  }
}