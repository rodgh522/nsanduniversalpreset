import { Component, OnInit } from '@angular/core';
import { Page, ScrollEventData, ScrollView, View } from '@nativescript/core';
import { StaticVariableService } from '../../global/static-variable';
import { PostApiService } from '../../service/post-api.service.tns';
import { Subscription } from 'rxjs';
import { Http, HttpResponse } from "@nativescript/core";

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.tns.html',
  styleUrls: ['./unit-list.component.tns.scss']
})
export class UnitListComponent implements OnInit {

  dataloader = false;
  selectedMenu = 'room';
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
  
  constructor(
    private _page: Page,
    private postApi: PostApiService,
    private staticVariable: StaticVariableService,
  ) { 

    this.srch = {
      AcomId: "2S1I44TF16",
      dates: [new Date()]
    };
  }

  ngOnInit(): void {
    this.startDate = this.srch.dates[0];
    this.endDate = new Date(Date.parse(this.srch.dates[this.srch.dates.length - 1].toString()) + 1000 * 60 * 60 * 24);
    this.getData();
    // this.http();
  }

  http(){
    let param = {
      ...this.srch,
      mapcode: 'getAcomDetail',
      dates: this.changeFormat(this.srch.dates),
      ChCode: '',
      straight: 1
    };
    Http.request({
      url: "http://59.15.3.210:8058/home/getAcomDetail.json",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      content: JSON.stringify(param),
    }).then(
      (response: HttpResponse) => {
        const result = response.content.toJSON();
        console.log(`Http POST Result: ${result}`)
      },
      (e) => {
        console.error(e);
      }
    );
  }

  onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
    // If the header content is still visiible
    // console.log(scrollView.verticalOffset);
    if (scrollView.verticalOffset < 250) {
        const offset = scrollView.verticalOffset / 2;
        if (scrollView.ios) {
            // iOS adjust the position with an animation to create a smother scrolling effect. 
            topView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
        } else {
            // Android, animations are jerky so instead just adjust the position without animation.
            topView.translateY = Math.floor(offset);
        }
    }
  }

  getData(){
    this.dataloader = true;

    let param = {
      ...this.srch,
      mapcode: 'getAcomDetail',
      dates: this.changeFormat(this.srch.dates),
      ChCode: '',
      straight: 1,
      GuestMax: 2
    };
    this.postApi.home(param, (res)=> {
      this.dataloader = false;
      if(res.header.status === 200) {
        this.data = res.body.docs[0];
        this.prepRoomInfo(this.data.rooms);
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

}
