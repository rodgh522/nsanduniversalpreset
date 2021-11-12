import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { action, isIOS, Page, ScrollEventData, ScrollView, View } from '@nativescript/core';
import { StaticVariableService } from '../../global/static-variable';
import { PostApiService } from '../../service/post-api.service.tns';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Carousel, CarouselCommon, CarouselUtil } from 'nativescript-carousel';
import { SearchService } from '@src/app/service/search.service';
import { Options } from 'nativescript-ngx-date-range/ngx-date-range.common';
import { ios } from '@nativescript/core/application';
import { create } from 'nativescript-ngx-date-range';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { DatePickerComponent } from '@src/app/shared/mobile/date-picker/date-picker.component.tns';
import { RerenderComponent } from '@src/app/shared/mobile/rerender/rerender.component.tns';
import { rootScope } from '@src/app/global/global';
import { getString } from '@nativescript/core/application-settings';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.tns.html',
  styleUrls: ['./unit-list.component.tns.scss']
})
export class UnitListComponent implements OnInit, OnDestroy {

  @ViewChild('topView', { static: false}) topView: ElementRef<Carousel>;
  dataloader = false;
  srch: any = {};
  subscription: Array<Subscription> = [];
  today = new Date();
  maxDay;
  startDate;
  endDate;
  data: any = {};
  list = [];
  reserve = [];
  accomInfo;
  review;
  selectedMenu = 2;
  options = [];
  dateRange;
  isIos = isIOS;
  reviewCnt = 0;
  
  constructor(
    private _page: Page,
    private postApi: PostApiService,
    private staticVariable: StaticVariableService,
    private activateRouter: ActivatedRoute,
    private searchService: SearchService,
    private modalService: ModalDialogService,
    private vref: ViewContainerRef,
    private router: Router
  ) { 

    const param = this.activateRouter.snapshot.params;
    this.srch = this.searchService.srch;
    console.dir(this.srch);
    this.srch.AcomId = param.acomId;
  }

  ngOnInit(): void {
    this.startDate = this.srch.dates[0];
    this.endDate = new Date(Date.parse(this.srch.dates[this.srch.dates.length - 1].toString()) + 1000 * 60 * 60 * 24);
    this.getData();
    this.getReview()
  }

  @HostListener('unloaded')
  ngOnDestroy(){}

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
        this.getData();
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
          this.getData();
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

  getData(){
    this.dataloader = true;
    let param = {
      ...this.srch,
      mapcode: 'getAcomDetail',
      dates: this.changeFormat(this.srch.dates),
      ChCode: getString('ChCode'),
    };
    this.postApi.home(param, (res)=> {
      this.reserve = [];
      this.dataloader = false;
      if(res.header.status === 200) {
        this.data = res.body.docs[0];
        this.setOptionList(this.data.options);
        this.prepRoomInfo(this.data.rooms);
      }
      this.rerender();
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

  prepRoomInfo(rooms: Array<any>){
    this.list = rooms.map((a)=> {
      a.adult = a.baseInfo[0].GuestStd ? a.baseInfo[0].GuestStd : 2;
      a.infant = 0;
      a.maxGuest = a.baseInfo[0].GuestMax ? a.baseInfo[0].GuestMax : 2;
      a.pet = a.baseInfo[0].PetStd ? a.baseInfo[0].PetStd : 0;
      a.addGuestPrice = 0;
      a.addPetPrice = 0;
      a.addOptionPrice = 0;
      a.toggleOption = false;
      a.photo = a.uploadFileList.length > 0 ? this.staticVariable.getFileDownloadUrl(a.uploadFileList[0].PhysicalFileNm) : '~/assets/images/no_image.jpg';
      a.isBlocked = a.BlockYN === 'Y' || a.reservedCnt > 0;
      a.roomPrice = a.ChPrice > 0 ? a.ChPrice : a.DFTPrice;
      a.saleRate = a.ChPrice != 0 ? Math.round((a.DFTPrice - a.ChPrice) / a.DFTPrice * 100) : 0;
      a.selectedOption = '';
      a.options = [];
      a.selected = false;
      return a;
    });
  }

  setOptionList(list: Array<any>){
    this.options = [];
    list.forEach((res)=> {
      this.options.push(res.ItemNm);
    });
  }

  openOptionList(target){
    console.dir(target);
    action('옵션상품', '닫기', this.options).then((res)=> {
      if(res !== '닫기') {
        this.addOption(target, res);
      }
    });
  }
  
  addOption(target, pickedUpOption){
    const duple = target.options.filter(a=> a.ItemNm === pickedUpOption);
    if(duple.length > 0) {
      return;
    }
    const item = this.data.options.filter(a=> a.ItemNm === pickedUpOption);
    if(item.length > 0) {
      item[0].totalCnt = 1;
      target.options.push(item[0]);
    }
    this.setOption(target, item[0], '-');
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
    if(room.adult + room.infant > room.baseInfo[0].GuestStd) {    // 성인 + 유아 > 기준인원
      if(room.baseInfo[0].GuestStd - room.adult < 0){             // 기준인원 < 성인
        room.addGuestPrice = ((room.adult - room.baseInfo[0].GuestStd) * (adult ? adult : 0)) * this.srch.straight;
        room.addGuestPrice += (room.infant * (infant ? infant : 0)) * this.srch.straight;
      }else {                                                     // 기준인원 > 성인
        room.addGuestPrice = (((room.adult + room.infant) - room.baseInfo[0].GuestStd) * (infant ? infant : 0)) * this.srch.straight;
      }
    }else{
      room.addGuestPrice = 0;
    }
  }

  setOption(item, option, action){
    let price = 0;
    if(action === '+') {
      option.totalCnt++;
    }else {
      option.totalCnt -= option.totalCnt > 1 ? 1 : 0;
    }

    item.options.forEach((a)=> {
      price += a.CashYN === 'Y' ? 0 : a.totalCnt * a.ItemPrice;
    });
    item.addOptionPrice = price;
  }

  delOption(item, idx){
    let price = 0;
    item.options.splice(idx, 1);

    item.options.forEach((a)=> {
      price += a.totalCnt * a.ItemPrice;
    });
    item.addOptionPrice = price;
  }

  setPet(item, action){
    if(action === '+') {
      item.pet += item.baseInfo[0].PetMax && item.baseInfo[0].PetMax > item.pet ? 1 : 0;
    }else {
      item.pet -= item.pet > 0 ? 1 : 0;
    }
    if(item.pet > item.baseInfo[0].PetStd) {
      item.addPetPrice = ((item.pet - item.baseInfo[0].PetStd) * item.baseInfo[0].PetAdd) * this.srch.straight;
    }else {
      item.addPetPrice = 0;
    }
  }

  setPrice(selected: boolean, item, roomId) {
    if(item.BlockYN === 'Y' || item.reservedCnt > 0) {
      return;
    }
    item.selected = selected;
    if(selected) {
      const idx = this.list.findIndex(a=> a.RoomId === roomId);
      if(idx > -1) {
        this.reserve.push(this.list[idx]);
      }
    }else {
      const idx = this.reserve.findIndex(a=> a.RoomId === roomId);
      this.reserve.splice(idx, 1);
    }
  }

  totalPrice(){
    let price = 0;
    this.reserve.forEach((a)=> {
      price += a.roomPrice + a.addGuestPrice + a.addPetPrice + a.addOptionPrice;
    });
    return price;
  }

  goPayment(){
    if(this.reserve.length === 0) {
      return;
    }
    
    let param = { 
      ...this.srch, 
      acomNm: this.data.AcomNm,
      checkin: this.data.CheckinTime,
      checkout: this.data.CheckoutTime,
      localYN: this.data.LocalDiscYN,
      localRate: this.data.LocalRate,
      localMax: this.data.LocalMax,
      rooms: [ ...this.reserve ]
    };
    rootScope.paymentData = param;

    this.router.navigate(['/payment']);
  }

  rerender(){
    const config = {
      viewContainerRef: rootScope.vcRef,
      fullscreen: true,
      dimAmount: 0
      
    };
    this.modalService.showModal(RerenderComponent, config);
  }

  getReview(){
    let param: any = {
      AcomId: this.srch.AcomId,
      mapcode: 'getReviewList'
    };
    
    this.postApi.home(param, (res)=> {
      if (res.header.status === 200) {
        this.reviewCnt = res.body.docs[0].list.length;
      }
    }); 
  }
  
}
