import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerToggle, MatDateRangeInput } from '@angular/material/datepicker';
import { rootScope } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { SearchService } from '@src/app/service/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit, OnDestroy {

  @ViewChild('matDateToggle') matDateToggle: MatDatepickerToggle<Date>;
  @ViewChild('rangeInput') rangeInput: MatDateRangeInput<Date>;
  
  dataloader = false;
  srch: any = {};
  subscription: Array<Subscription> = [];
  today = new Date();
  maxDay;
  startDate;
  endDate;
  data: any = {};
  list = [];

  constructor(
    private searchService: SearchService,
    private postApi: PostApiService
  ) { 
    this.maxDay = new Date(Date.parse(this.today.toString()) + 30 * 1000 * 60 * 60 * 24);
    
    this.subscription.push(this.searchService.searchDetail.subscribe(res=> {
      this.srch = res;
    }));
  }

  ngOnInit(): void {
    if(rootScope.isWeb) {
      this.startDate = this.srch.dates[0];
      this.endDate = new Date(Date.parse(this.srch.dates[this.srch.dates.length - 1].toString()) + 1000 * 60 * 60 * 24);

      this.getData();
    }
  }

  ngOnDestroy(){
    this.subscription.forEach(a=> a.unsubscribe());
  }

  getData(){
    this.dataloader = true;
    this.searchService.setSearchDetail(this.srch);

    let param = {
      ...this.srch,
      mapcode: 'getAcomDetail',
      dates: this.changeFormat(this.srch.dates)
    };
    this.postApi.home(param, (res)=> {
      this.dataloader = false;
      if(res.header.status === 200) {
        this.data = res.body.docs[0];
        this.prepRoomInfo(this.data.rooms);
        console.log(this.data);
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
    if(!date.start || !date.end) {
      return;
    }
    this.setDate(date.start, date.end);
    this.getData();
  }
  
  setDate(beginDt: Date, endDt: Date){
    this.startDate = beginDt;
    this.endDate = endDt;

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

  prepRoomInfo(rooms: Array<any>){
    this.list = rooms.map((a)=> {
      a.adult = a.baseInfo[0].GuestStd;
      a.infant = 0;
      a.maxGuest = a.baseInfo[0].GuestMax;
      a.addGuestPrice = 0;
      a.addPetPrice = 0;
      a.addOptionPrice = 0;
      a.roomPrice = a.ChPrice > 0 ? a.ChPrice : a.DFTPrice;
      a.saleRate = a.ChPrice != 0 ? (a.DFTPrice - a.ChPrice) / a.DFTPrice * 100 : 0;
      a.selectedOption = '';
      a.options = [];
      return a;
    });
  }

  addOption(target){
    const duple = target.options.filter(a=> a.ItemId === target.selectedOption);
    if(target.selectedOption == '') {
      return;
    }
    if(duple.length > 0) {
      return;
    }
    const item = this.data.options.filter(a=> a.ItemId === target.selectedOption);
    if(item.length > 0) {
      item[0].totalCnt = 1;
      target.options.push(item[0]);
    }
  }

  setGuest(room, target, action){
    if(action === '+') {
      if(room.adult + room.infant < room.maxGuest) {
        room[target]++;
      }
    }else {
      if(room[target] > 0) {
        room[target]--;
      }
    }
    const adult = room.baseInfo[0].Adult;
    const infant = room.baseInfo[0].Infant;
    if(room.adult + room.infant > room.baseInfo[0].GuestStd) {
      if(room.baseInfo[0].GuestStd - room.adult < 0){
        room.addGuestPrice = (room.adult - room.baseInfo[0].GuestStd) * (adult ? adult : 0);
        room.addGuestPrice += room.infant * (infant ? infant : 0);
      }else {
        room.addGuestPrice = ((room.adult + room.infant) - room.baseInfo[0].GuestStd) * (infant ? infant : 0);
      }
    }else{
      room.addGuestPrice = 0;
    }
  }

  setOption(option, action){
    if(action === '+') {
      option.totalCnt++;
    }else {
      option.totalCnt -= option.totalCnt > 1 ? 1 : 0;
    }
  }

  setPrice(target, price, action){
    if(action === '+') {
      target.totalPrice += price
    }else {
      target.totalPrice -= price
    }
  }

}
