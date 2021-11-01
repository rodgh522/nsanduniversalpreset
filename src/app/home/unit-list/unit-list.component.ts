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
  questionform: FormGroup;
  questionupdform: FormGroup;
  reviewcommform: FormGroup;
  reviewcommupdform: FormGroup;
  uploadFileList = [];
  uploadReviewFileList = [];
  uploadReviewUpdFileList = [];
  uploadQuestionFileList = [];
  uploadQuestionUpdFileList = [];
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
  questionlist = [];
  reserve = [];
  accomInfo;
  review;
  loginUserId;

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
      Content: ['', []],
      Score: ['', []]
    });
    this.reviewupdform = fb.group({
      Content: ['', []],
      Score: ['', []]
    });
    this.reviewcommform = fb.group({
      Content: ['', []]
    });
    this.reviewcommupdform = fb.group({
      Content: ['', []]
    });
    this.questionform = fb.group({
      Content: ['', []]
    });
    this.questionupdform = fb.group({
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
      this.getQuestion();
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
        //if(!this.reviewlist) {
          this.getReview();
        //}
      break;
      case 'question':
        //if(!this.questionlist) {
          this.getQuestion();
        //}
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
    this.uploadReviewFileList = [...e];
  }
  /* 첨부파일 컴포넌트와 데이터 sync */
  syncUpdFileList(e){
    this.uploadReviewUpdFileList = [...e];
  }

  getReview() {
    this.loginUserId = rootScope.gVariable.MemId;
    this.dataloader = true;
    let param: any = {
      AcomId: this.srch.AcomId,
      mapcode: 'getReviewList'
    };
    

    this.postApi.home(param, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.reviewlist = res.body.docs[0].list;
        for (let i = 0; i < this.reviewlist.length; i++) {
          this.reviewlist[i].moreButton = false;
          this.reviewlist[i].updContents = false;
          this.reviewlist[i].commButton = false;
          const reviewday = new Date(this.reviewlist[i].RegDate);
          this.reviewlist[i].RegDate = reviewday.toLocaleDateString();
          var filelist = [];
          this.reviewlist[i].uploadfileList.forEach(e => {
            var flist ={
              id : e.fileId,
              isLoaded : true,
              link : this.staticVariable.getUrl2('/attach/file/' + e.PhysicalFileNm + '/download.do?userkey=' + this.reviewlist[i].MemId),
              fileName : e.LogicalFileNm,
              size : e.FileSize,
              fileKey : e.PhysicalFileNm,
              path : e.PhysicalPath,
              downloadCnt : e.DownloadCnt,
              delState: ""
            };
            filelist.push(flist);
            this.reviewlist[i].uploadfileList = filelist.map(a => {
              let b = a;
              return b;
            });
          });
          this.getReviewComment(this.reviewlist[i]);
        }
        this.dataloader = false;
        console.log(this.reviewlist);
      }
    }); 
    setTimeout(()=> {
      this.refreshFile = 0;
    }, 500);
  }
  getReviewComment(list) {
    let param: any = {
      AcomId: this.srch.AcomId,
      ReviewId: list.ReviewId,
      mapcode: 'CommunityQuery.getReviewComment'
    };
        this.postApi.movilaSelect(param, (res)=> {
          if (res.header.status === CONSTANT.HttpStatus.OK) {
            list['reviewcommlist'] = res.body.docs;
            for (let i = 0; i < list['reviewcommlist'].length; i++) {
              list['reviewcommlist'][i].moreButton = false;
              list['reviewcommlist'][i].updComment = false;
              const reviewcommday = new Date(list['reviewcommlist'][i].RegDate);
              list['reviewcommlist'][i].RegDate = reviewcommday.toLocaleDateString();
            } 
          }
        });
  }

  
  buttonMore(target){
    target.moreButton = !target.moreButton;
  }

  buttonComm(target){
    target.commButton = !target.commButton;
    if (target.commButton) {
      for (let i = 0; i < this.reviewlist.length; i++) {
        if (target.ReviewId == this.reviewlist[i].ReviewId) {
          target.commButton = true;
        }
        else {
          this.reviewlist[i].commButton = false;
        }
      }
    }
  }
  
  buttonUpd(target){
    target.updContents = !target.updContents;
    if (target.updContents) {
      for (let i = 0; i < this.reviewlist.length; i++) {
        if (target.ReviewId == this.reviewlist[i].ReviewId) {
          target.updContents = true;
          this.reviewupdform.controls['Content'].setValue(target.Contents);
          this.reviewupdform.controls['Score'].setValue(target.Score);
        }
        else {
          this.reviewlist[i].updContents = false; 
          for (let j = 0; j < this.reviewlist[i].reviewcommlist.length; j++) {
            this.reviewlist[i].reviewcommlist[j].updComment = false;
          }
        }
      }
    }
  }

  buttonCommUpd(target){
    target.updComment = !target.updComment;
    if (target.updComment) {
      for (let i = 0; i < this.reviewlist.length; i++) {
        if (target.ReviewId == this.reviewlist[i].ReviewId) {
          for (let j = 0; j < this.reviewlist[i].reviewcommlist.length; j++) {
            if (target.ReviewCommId == this.reviewlist[i].reviewcommlist[j].ReviewCommId) {
              target.updComment = true;
              this.reviewcommupdform.controls['Content'].setValue(target.Contents);
            }
            else {
              this.reviewlist[i].reviewcommlist[j].updComment = false;
            }
          }
        }
        else {
          this.reviewlist[i].updContents = false;
          for (let j = 0; j < this.reviewlist[i].reviewcommlist.length; j++) {
            this.reviewlist[i].reviewcommlist[j].updComment = false;
          }
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
    if(isNullOrEmpty(this.reviewform.controls['Score'].value)){
      this.dialog.alert({msg:'평점을 선택해 주세요.'});
      return;
    }
    const data = {
      MemId: rootScope.gVariable.MemId,
      AcomId: this.srch.AcomId,
      Contents: this.reviewform.controls['Content'].value,
      Score: this.reviewform.controls['Score'].value,
      mapcode: 'CommunityQuery.insertReview',
      uploadFileList: this.uploadReviewFileList,
      tableNm: 'review'
    };
    this.postApi.movilaInsert(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.dialog.alert({msg:'등록되었습니다.'});

        this.reviewform.controls['Content'].setValue('');
        this.reviewform.controls['Score'].setValue('');
        this.uploadReviewFileList = [];
        this.refreshFile++;

        this.getReview();
        this.router.navigate(['/unit', JSON.stringify(this.srch)]);
        
        
      }
    });
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
              this.getReview();
              this.router.navigate(['/unit', JSON.stringify(this.srch)]);
            }
          });
        }else {
          return;
        }
      }
    });
  }

  reviewCommDel(target) {
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
            ReviewCommId: target.ReviewCommId,
            MemId: rootScope.gVariable.MemId,
            mapcode: 'CommunityQuery.deleteReviewComment'
          };
          this.postApi.movilaUpdate(data, (res)=> {
            if (res.header.status === CONSTANT.HttpStatus.OK) {
              this.dialog.alert({msg:'삭제되었습니다.'});
              this.getReview();
              this.router.navigate(['/unit', JSON.stringify(this.srch)]);
            }
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
    if(isNullOrEmpty(this.reviewupdform.controls['Score'].value)){
      this.dialog.alert({msg:'평점을 선택해 주세요.'});
      return;
    }
    
    const data = {
      ReviewId: target.ReviewId,
      MemId: rootScope.gVariable.MemId,
      AcomId: this.srch.AcomId,
      Contents: this.reviewupdform.controls['Content'].value,
      Score: this.reviewupdform.controls['Score'].value,
      mapcode: 'CommunityQuery.updateReview',
      uploadFileList: [...this.uploadReviewUpdFileList, ...target.uploadfileList],
      tableNm: 'review',
      TableId: target.ReviewId
    };
    this.postApi.movilaUpdate(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.dialog.alert({msg:'수정되었습니다.'});

        this.reviewupdform.controls['Content'].setValue('');
        this.reviewupdform.controls['Score'].setValue('');
        this.uploadReviewUpdFileList = [];
        this.refreshFile++;

        this.getReview();
        this.router.navigate(['/unit', JSON.stringify(this.srch)]);
      }
    }); 
  }
  
  reviewcommReg(list){
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

    if(isNullOrEmpty(this.reviewcommform.controls['Content'].value)){
      this.dialog.alert({msg:'답글을 작성해 주세요.'});
      return;
    }
    const data = {
      MemId: rootScope.gVariable.MemId,
      ReviewId: list.ReviewId,
      Contents: this.reviewcommform.controls['Content'].value,
      mapcode: 'CommunityQuery.insertReviewComment'
    };
    this.postApi.movilaInsert(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.dialog.alert({msg:'등록되었습니다.'});
        this.getReview();
        this.router.navigate(['/unit', JSON.stringify(this.srch)]);
        this.reviewcommform.controls['Content'].setValue('');
      }
    });
  }
  
  reviewcommUpd(target) {
    if(isNullOrEmpty(this.reviewcommupdform.controls['Content'].value)){
      this.dialog.alert({msg:'답글을 작성해 주세요.'});
      return;
    }
    const data = {
      ReviewCommId: target.ReviewCommId,
      MemId: rootScope.gVariable.MemId,
      Contents: this.reviewcommupdform.controls['Content'].value,
      mapcode: 'CommunityQuery.updateReviewComment'
    };
    this.postApi.movilaUpdate(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.dialog.alert({msg:'수정되었습니다.'});
        this.getReview();
        this.router.navigate(['/unit', JSON.stringify(this.srch)]);
        this.reviewcommupdform.controls['Content'].setValue('');
      }
    });    
  }
  changeValue(value, item){
    if (value == '') {
      item.delState = 'delete';
    }
    else if (value == 'delete') {
      item.delState  = '';
    }

  }
  
  /* 첨부파일 컴포넌트와 데이터 sync */
  syncQFileList(e){
    this.uploadQuestionFileList = [...e];
  }
  /* 첨부파일 컴포넌트와 데이터 sync */
  syncQUpdFileList(e){
    this.uploadQuestionUpdFileList = [...e];
  }

  getQuestion() {
    this.loginUserId = rootScope.gVariable.MemId;
    this.dataloader = true;
    let param: any = {
      AcomId: this.srch.AcomId,
      mapcode: 'getQuestionList'
    };
    

    this.postApi.home(param, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.questionlist = res.body.docs[0].list;
        for (let i = 0; i < this.questionlist.length; i++) {
          this.questionlist[i].moreButton = false;
          this.questionlist[i].updContents = false;
          this.questionlist[i].commButton = false;
          const questionday = new Date(this.questionlist[i].RegDate);
          this.questionlist[i].RegDate = questionday.toLocaleDateString();
          var filelist = [];
          this.questionlist[i].uploadfileList.forEach(e => {
            var flist ={
              id : e.fileId,
              isLoaded : true,
              link : this.staticVariable.getUrl2('/attach/file/' + e.PhysicalFileNm + '/download.do?userkey=' + this.questionlist[i].MemId),
              fileName : e.LogicalFileNm,
              size : e.FileSize,
              fileKey : e.PhysicalFileNm,
              path : e.PhysicalPath,
              downloadCnt : e.DownloadCnt,
              delState: ""
            };
            filelist.push(flist);
            this.questionlist[i].uploadfileList = filelist.map(a => {
              let b = a;
              return b;
            });
          });
          this.getQuestionComment(this.questionlist[i]);
        }
        this.dataloader = false;
        console.log(this.questionlist);
      }
    }); 
    setTimeout(()=> {
      this.refreshFile = 0;
    }, 500);
  }
  getQuestionComment(list) {
    let param: any = {
      AcomId: this.srch.AcomId,
      QuestionId: list.QuestionId,
      mapcode: 'CommunityQuery.getQuestionComment'
    };
        this.postApi.movilaSelect(param, (res)=> {
          if (res.header.status === CONSTANT.HttpStatus.OK) {
            if (res.body.docCnt > 0) {
              list['questioncommlist'] = res.body.docs;
              for (let i = 0; i < list['questioncommlist'].length; i++) {
                list['questioncommlist'][i].moreButton = false;
                list['questioncommlist'][i].updComment = false;
                const questioncommday = new Date(list['questioncommlist'][i].RegDate);
                list['questioncommlist'][i].RegDate = questioncommday.toLocaleDateString();
              } 
            }
          }
        });
  }

  buttonQComm(target){
    target.commButton = !target.commButton;
    if (target.commButton) {
      for (let i = 0; i < this.questionlist.length; i++) {
        if (target.QuestionId == this.questionlist[i].QuestionId) {
          target.commButton = true;
        }
        else {
          this.questionlist[i].commButton = false;
        }
      }
    }
  }
  
  buttonQUpd(target){
    target.updContents = !target.updContents;
    if (target.updContents) {
      for (let i = 0; i < this.questionlist.length; i++) {
        if (target.QuestionId == this.questionlist[i].QuestionId) {
          target.updContents = true;
          this.questionupdform.controls['Content'].setValue(target.Contents);
        }
        else {
          this.questionlist[i].updContents = false; 
          if (this.questionlist[i].questioncommlist) {
            for (let j = 0; j < this.questionlist[i].questioncommlist.length; j++) {
              this.questionlist[i].questioncommlist[j].updComment = false;
            }
          }
        }
      }
    }
  }

  questionReg(){
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

    if(isNullOrEmpty(this.questionform.controls['Content'].value)){
      this.dialog.alert({msg:'문의 사항을 작성해 주세요.'});
      return;
    }
    const data = {
      MemId: rootScope.gVariable.MemId,
      AcomId: this.srch.AcomId,
      Contents: this.questionform.controls['Content'].value,
      mapcode: 'CommunityQuery.insertQuestion',
      uploadFileList: this.uploadQuestionFileList,
      tableNm: 'question'
    };
    this.postApi.movilaInsert(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.dialog.alert({msg:'등록되었습니다.'});

        this.questionform.controls['Content'].setValue('');
        this.uploadQuestionFileList = [];
        this.refreshFile++;

        this.getQuestion();
        this.router.navigate(['/unit', JSON.stringify(this.srch)]);
        
        
      }
    });
  }

  questionDel(target) {
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
            QuestionId: target.QuestionId,
            MemId: rootScope.gVariable.MemId,
            AcomId: this.srch.AcomId,
            mapcode: 'CommunityQuery.deleteQuestion'
          };
          this.postApi.movilaUpdate(data, (res)=> {
            if (res.header.status === CONSTANT.HttpStatus.OK) {
              this.dialog.alert({msg:'삭제되었습니다.'});
              this.getQuestion();
              this.router.navigate(['/unit', JSON.stringify(this.srch)]);
            }
          });
        }else {
          return;
        }
      }
    });
  }


  questionUpd(target) {
    if(isNullOrEmpty(this.questionupdform.controls['Content'].value)){
      this.dialog.alert({msg:'문의 사항을 작성해 주세요.'});
      return;
    }
    
    const data = {
      QuestionId: target.QuestionId,
      MemId: rootScope.gVariable.MemId,
      AcomId: this.srch.AcomId,
      Contents: this.questionupdform.controls['Content'].value,
      mapcode: 'CommunityQuery.updateQuestion',
      uploadFileList: [...this.uploadQuestionUpdFileList, ...target.uploadfileList],
      tableNm: 'question',
      TableId: target.QuestionId
    };
    this.postApi.movilaUpdate(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        this.dialog.alert({msg:'수정되었습니다.'});

        this.questionupdform.controls['Content'].setValue('');
        this.uploadQuestionUpdFileList = [];
        this.refreshFile++;

        this.getQuestion();
        this.router.navigate(['/unit', JSON.stringify(this.srch)]);
      }
    }); 
  }
  
  
}
