import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerToggle, MatDateRangeInput } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { formToObj, rootScope, isNullOrEmpty, objToForm} from '@src/app/global/global';
import { StaticVariableService } from '@src/app/global/static-variable';
import { DialogService } from '@src/app/service/dialog.service';
import { PostApiService } from '@src/app/service/post-api.service';
import { SearchService } from '@src/app/service/search.service';
import { SessionService } from '@src/app/service/session.service';
import { ImgViewerComponent } from '@src/app/shared/modal/img-viewer/img-viewer.component';
import { Subscription } from 'rxjs';
import { CONSTANT } from '@src/assets/global-constant';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit {

  @ViewChild('matDateToggle') matDateToggle: MatDatepickerToggle<Date>;
  @ViewChild('rangeInput') rangeInput: MatDateRangeInput<Date>;

  reviewform: FormGroup;
  reviewupdform: FormGroup;
  uploadFileList = [];
  refreshFile = 0;
  
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
  reviewlist = [];
  reserve = [];
  accomInfo;
  review;
  userid = rootScope.gVariable.MemId;

  constructor(
    private fb: FormBuilder,
    private activeRouter: ActivatedRoute,
    private postApi: PostApiService,
    private dialog: DialogService,
    private staticVariable: StaticVariableService,
    private router: Router,
    private session: SessionService
  ) { 
    this.maxDay = new Date(Date.parse(this.today.toString()) + 30 * 1000 * 60 * 60 * 24);

    this.reviewform = fb.group({
      Content: ['', []]
    });
    this.reviewupdform = fb.group({
      Content: ['', []]
    });

    this.srch = JSON.parse(this.activeRouter.snapshot.params.param);
    this.setDateData();
  }

  ngOnInit(): void {
    if(rootScope.isWeb) {
      this.startDate = this.srch.dates[0];
      this.endDate = new Date(Date.parse(this.srch.dates[this.srch.dates.length - 1].toString()) + 1000 * 60 * 60 * 24);

      this.getData();
      this.getReview();
    }
  }

  setDateData(){
    this.srch.dates = this.srch.dates.map((a)=> {
      let b = new Date(a);
      return b;
    });
  }

  getData(){
    this.dataloader = true;

    let param = {
      ...this.srch,
      mapcode: 'getAcomDetail',
      dates: this.changeFormat(this.srch.dates),
      ChCode: sessionStorage.getItem('ChCode')
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
    this.router.navigate(['/unit', JSON.stringify(this.srch)]);
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
      a.adult = a.baseInfo[0].GuestStd ? a.baseInfo[0].GuestStd : 2;
      a.infant = 0;
      a.maxGuest = a.baseInfo[0].GuestMax ? a.baseInfo[0].GuestMax : 2;
      a.pet = a.baseInfo[0].PetStd ? a.baseInfo[0].PetStd : 0;
      a.addGuestPrice = 0;
      a.addPetPrice = 0;
      a.addOptionPrice = 0;
      a.toggleOption = false;
      a.photo = a.uploadFileList.length > 0 ? this.staticVariable.getFileDownloadUrl(a.uploadFileList[0].PhysicalFileNm) : 'assets/images/no_image.jpg';
      a.isBlocked = a.BlockYN === 'Y' || a.reservedCnt > 0;
      a.roomPrice = a.ChPrice > 0 ? a.ChPrice : a.DFTPrice;
      a.saleRate = a.ChPrice != 0 ? Math.round((a.DFTPrice - a.ChPrice) / a.DFTPrice * 100) : 0;
      a.selectedOption = '';
      a.options = [];
      a.selected = false;
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

  setMenu(target){
    this.selectedMenu = target;
    let param: any = {
      AcomId: this.srch.AcomId
    };
    switch(target) {
      case 'accom': 
        if(!this.accomInfo) {
          param.mapcode = 'getAcomInfo';
          this.postApi.home(param, (res)=> {
            if(res.header.status === 200) {
              this.accomInfo = res.body.docs[0];
            }
          });
        }
      break;
      case 'review':
        this.getReview();
      break;
    }
  }

  openViewer(files){
    if(!files || files.length === 0) {
      return;
    }
    let config: MatDialogConfig = { 
      hasBackdrop: true,
      maxWidth: '900px'
    };
    this.dialog.modal(ImgViewerComponent, files, config);
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

    if(!this.session.user$.value) {
      this.askLogin();
      return;
    }
    this.router.navigate(['/payment']);
  }

  askLogin(){
    const data = {
      msg: '로그인하지 않았습니다. 비회원으로 진행하시겠습니까?',
      ok: {
        msg: '예약하기',
      },
      cancel: {
        msg: '로그인',
      }
    };

    this.dialog.confirm(data).toPromise()
    .then((res)=> {
      if(res) {
        if(res === 'ok') {
          this.router.navigate(['/payment']);
        }else {
          rootScope.savedUrl = this.router.url;
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

  /* 첨부파일 컴포넌트와 데이터 sync */
  syncFileList(e){
    this.uploadFileList = [...e];
  }

  getReview() {
    let param: any = {
      AcomId: this.srch.AcomId,
      mapcode: 'CommunityQuery.getReviewList'
    };
        this.postApi.movilaSelect(param, (res)=> {
          if (res.header.status === CONSTANT.HttpStatus.OK) {
            this.reviewlist = res.body.docs;
            for (let i = 0; i < this.reviewlist.length; i++) {
              this.reviewlist[i].moreButton = false;
              this.reviewlist[i].updContents = false;
            }
            
          console.log(this.reviewlist);
          }
        });
  }

  buttonMore(target){
    target.moreButton = !target.moreButton;
  }
  
  buttonUpd(target){
    target.updContents = !target.updContents;
    console.log(target);
    console.log(this.reviewlist);
    if (target.updContents) {
      for (let i = 0; i < this.reviewlist.length; i++) {
        if (target.ReviewId == this.reviewlist[i].ReviewId) {
          target.updContents = true;
          this.reviewupdform.controls['Content'].setValue(target.Contents);
        }
        else {
          this.reviewlist[i].updContents = false;
          console.log(this.reviewlist[i].updContents);
        }
      }
    }
  }

  reviewReg(){
    if(!this.session.user$.value) {
      const data = {
        msg: '로그인하지 않았습니다. 로그인하시겠습니까?',
        ok: {
          msg: '로그인',
        },
        cancel: {
          msg: '취소',
        }
      };
  
      this.dialog.confirm(data).toPromise()
      .then((res)=> {
        if(res) {
          if(res === 'ok') {
            rootScope.savedUrl = this.router.url;
            this.router.navigate(['/login']);
          }else {
            return;
          }
        }
      });
    }

    if(isNullOrEmpty(this.reviewform.controls['Content'].value)){
      this.dialog.alert({msg:'리뷰를 작성해 주세요.'});
      return;
    }
    const data = {
      MemId: rootScope.gVariable.MemId,
      AcomId: this.srch.AcomId,
      Contents: this.reviewform.controls['Content'].value,
      Score: 5,
      mapcode: 'CommunityQuery.insertReview'
    };
    this.postApi.movilaInsert(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.dialog.alert({msg:'등록되었습니다.'});
        this.router.navigate(['/unit', JSON.stringify(this.srch)]);
      }
      console.log(res);
    });
    console.log(this.reviewform.controls['Content'].value); 
  }

  reviewDel(target) {
    const dat = {
      msg: '정말 삭제 하시겠습니까?',
      ok: {
        msg: '삭제',
      },
      cancel: {
        msg: '취소',
      }
    };

    this.dialog.confirm(dat).toPromise()
    .then((res)=> {
      if(res) {
        if(res === 'ok') {
          const data = {
            ReviewId: target.ReviewId,
            MemId: rootScope.gVariable.MemId,
            AcomId: this.srch.AcomId,
            mapcode: 'CommunityQuery.deleteReview'
          };
          this.postApi.movilaUpdate(data, (res)=> {
            if (res.header.status === CONSTANT.HttpStatus.OK) {
              this.dialog.alert({msg:'삭제되었습니다.'});
              this.setMenu('review');
            }
            console.log(res);
          });
        }else {
          return;
        }
      }
    });
  }

  reviewUpd(target) {
    if(isNullOrEmpty(this.reviewupdform.controls['Content'].value)){
      this.dialog.alert({msg:'리뷰를 작성해 주세요.'});
      return;
    }
    const data = {
      ReviewId: target.ReviewId,
      MemId: rootScope.gVariable.MemId,
      AcomId: this.srch.AcomId,
      Contents: this.reviewupdform.controls['Content'].value,
      Score: 5,
      mapcode: 'CommunityQuery.updateReview'
    };
    this.postApi.movilaUpdate(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.dialog.alert({msg:'수정되었습니다.'});
        this.router.navigate(['/unit', JSON.stringify(this.srch)]);
      }
      console.log(res);
    });    
  }
  
}
