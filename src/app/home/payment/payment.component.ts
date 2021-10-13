import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { changeFormat, formToObj, isNullOrEmpty, rootScope, validCheck } from '@src/app/global/global';
import { DialogService } from '@src/app/service/dialog.service';
import { PostApiService } from '@src/app/service/post-api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  userInfo;
  data: any;
  couponList = [];
  formInfo: FormGroup;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private postApi: PostApiService,
    private dialog: DialogService,
    private router: Router
  ) { 
    this.data = rootScope.paymentData;
    this.userInfo = rootScope.gVariable;
  }

  ngOnInit(): void {
    if(rootScope.isWeb) {
      if(isNullOrEmpty(this.data)) {
        this.location.back();
      }else{
        this.data.rooms[0].PrintCode = '1707200342';
        this.data.rooms[0].VerifyCode = 'CMB2-L85M-J65C';
        this.addShipping();
        console.log(this.data);

      }
    }
    this.formInit();
  }

  formInit(){
    console.log(this.userInfo);
    this.formInfo = this.fb.group({
      GuestNm: [this.userInfo.MemNm ? this.userInfo.MemNm : '', [
        Validators.required
      ]],
      Mobile: [this.userInfo.Mobile ? this.userInfo.Mobile : '', [
        Validators.required
      ]],
      Email: ['', []],
      Memo: ['', []],
      PaymentTy: ['', []]
      // emailGroup: ['', []]
    })
  }

  setData(){
    if(this.isFormCompleted()) {
      return;
    }
    let form = formToObj(this.formInfo.controls);
    let param: any = { ...form, ...this.data };
    param.dates = changeFormat(this.data.dates);
    console.log(param);
  }

  isFormCompleted(){
    if(validCheck(this.formInfo.controls)){
      for(const key in this.formInfo.controls){
        if(this.formInfo.controls[key]){
          this.formInfo.controls[key].markAsTouched();
        }
      }
      return true;
    }else {
      return false;
    }
  }

  searchCoupon(item) {
    if(item.localYN) {
      item.coupon.resultCode = 0;
      item.coupon.msg = '중복할인은 적용되지 않습니다.';
      return;
    }
    
    // 이전에 적용시킨 쿠폰이 있는지 확인
    if(item.prevCode) {
      this.removeCoupon(item);                    // 같지 않으면 적용 쿠폰리스트에서 이전 쿠폰 제거
    }
    item.prevCode = item.PrintCode;
    item.coupon = {};
    if(this.checkDupleCoupon(item.PrintCode)) {   // 적용 쿠폰 리스트에 먼저 등록되었는지 체크
      item.coupon = {
        resultCode: 0,
        msg: '적용된 객실이 있습니다.'
      };
      return;
    }
    const dates = this.changeFormat(this.data.dates);
    let param: any = {
      mapcode: 'searchCoupon',
      dates: dates,
      ChCode: sessionStorage.getItem('ChCode'),
      AcomId: this.data.AcomId,
      UnitId: item.UnitId,
      PrintCode: item.PrintCode,
      VerifyCode: item.VerifyCode
    };
    this.postApi.home(param, (res)=>{
      if(res.header.status === 200) {
        item.coupon = res.body.docs[0];
        if(item.coupon.resultCode === 1) {
          this.adjCoupon(item);
        }
      }
    });
  }

  // 쿠폰 검색시 'yyyy-mm-dd' 데이터와 day(0 - 6) 데이터 필요
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

  // 적용 쿠폰 리스트에 추가 (할인요금 계산)
  adjCoupon(item){
    let coupon = {...item.coupon.result};
    let sleepInRow = typeof this.data.straight === 'string' ? parseInt(this.data.straight) : this.data.straight;
    const guestPrice = item.addGuestPrice / sleepInRow;
    if(coupon.CouponTy === 'PASS') {
      item.salePrice = coupon.orgPrice + guestPrice;
    }else {
      item.salePrice = coupon.Discount > coupon.orgPrice ? coupon.orgPrice : coupon.Discount;     // 할인 한도가 객실금액을 넘지 못한다.
    }
    coupon.RoomId = item.RoomId;
    coupon.PrintCode = item.PrintCode;
    this.couponList.push(coupon);
    console.log(this.couponList);
  }
  
  // 퇴실일 계산
  makeLastDay(date: Date) {
    return new Date(Date.parse(date.toString()) + 1000 * 60 * 60 * 24);
  }

  // 적용된 쿠폰 중복체크
  checkDupleCoupon(newCode){
    const duple = this.couponList.filter(a=> a.PrintCode == newCode);
    if(duple.length > 0) {
      return true;
    }else {
      return false;
    }
  }

  // 적용 쿠폰 제거 및 할인요금 제거
  removeCoupon(item) {
    item.coupon = {};
    item.salePrice = 0;
    const idx = this.couponList.findIndex(a=> a.RoomId == item.RoomId);
    if(idx > -1) {                                        // 리스트에 있으면 제거
      this.couponList.splice(idx, 1);
    }
  }

  // DeliveryYN 체크된 옵션 요금 5만원 미만 배송료 추가
  addShipping(){
    let total = 0;
    this.data.rooms.forEach((a)=> {
      a.options.forEach((b)=> {
        total += b.DeliveryYN === 'Y' ? b.ItemPrice * b.totalCnt : 0;
      });
    });
    this.data.shipping = total > 0 && total < 50000 ? true : false;
  }
  
  // 쿠폰 미적용
  onChangeCoupon(item){
    if(!item.useCoupon) {
      this.removeCoupon(item);
      this.resetCode(item);
    }
  }

  resetCode(item){
    item.PrintCode = '';
    item.VerifyCode = '';
  }

  // 지역민 할인 적용
  localDisc(e, item, idx) {
    if(e.target.checked) {
      if(item.useCoupon) {
        item.coupon.resultCode = 0;
        item.coupon.msg = '중복할인은 적용되지 않습니다.';
        item.localYN = false;
        return;
      }

      this.data.rooms.forEach((a, i)=> {
        if(i === idx) {
          a.localYN = true;
        }else {
          a.localYN = false;
          a.roomPrice = a.ChPrice > 0 ? a.ChPrice : a.DFTPrice;
          a.salePrice = a.useCoupon ? a.salePrice : 0;
        }
      });
      this.removeCoupon(item);
      item.roomPrice = item.DFTPrice;
      item.salePrice = Math.round((item.DFTPrice + item.addGuestPrice) * (this.data.localRate / 100));
    }else {
      item.roomPrice = item.ChPrice > 0 ? item.ChPrice : item.DFTPrice;
      item.salePrice = 0;
    }
  }

  // 총 결제금액 계산
  finalPrice(){
    if(!this.data && !this.data.rooms) {
      return;
    }
    let price = 0;
    this.data.rooms.forEach((a)=> {
      price += a.roomPrice + a.addGuestPrice + a.addPetPrice + a.addOptionPrice - (a.salePrice && a.salePrice > 0 ? a.salePrice : 0);
    });
    this.data.finalPrice = price += this.data.shipping ? 3000 : 0;
    return price;
  }

  checkValid(target){
    return this.formInfo.controls[target].touched && !this.formInfo.controls[target].valid;
  }

  // 결제 후 예약
  pay(){
    if(validCheck(this.formInfo.controls)){
      for(const key in this.formInfo.controls){
        if(this.formInfo.controls[key]){
          this.formInfo.controls[key].markAsTouched();
        }
      }
      return;
    }
    const formData = formToObj(this.formInfo.controls);
    const payment = {
      PayStatus: 'SUCCESS',
      PaymentTy: formData.PaymentTy,
      PaymentNum: '12841893',
      OrderTotal: this.data.finalPrice,
      PayTotal: this.data.finalPrice,
      CashReceipt: 'Y'
    };

    this.makeData();
    let param = {
      ...formData, 
      payment: payment,
      rooms: this.data.rooms,
      MemId: this.userInfo.MemId ? this.userInfo.MemId : '',
      ResvStat: 'COM',
      ChCode: this.userInfo.ChCode ? this.userInfo.ChCode : '',
      CheckinDt: this.data.dates[0].toStrFormat(),
      CheckoutDt: this.makeLastDay(this.data.dates[this.data.dates.length - 1]).toStrFormat(),
      mapcode: 'makeBooking'
    };
    console.log(param);

    this.postApi.home(param, (res)=>{
      if(res.header.status === 200) {
        const result = res.body.docs[0];
        const args = {
          rooms: result.rooms,
          resvStat: result.ResvStat
        };
        this.router.navigate(['/complete', JSON.stringify(args)]);
      }else if(res.header.status === 406) {
        this.dialog.alert({msg: res.body.docs[0].errMessage});
      }
    });
  }
  
  makeData(){
    // 할인 적용 항목
    this.data.rooms.forEach((a)=> {
      let discount: any;
      if(a.coupon && a.coupon.resultCode === 1) {
        discount = {
          CouponId: a.coupon.result.CouponId,
          Promotion: a.coupon.result.CouponNm,
          PromotionPrice: a.salePrice
        };
      }else if(a.localYN) {
        discount = {
          CouponId: '',
          Promotion: '지역민할인',
          PromotionPrice: a.salePrice
        };
      }
      a.discount = discount ? [discount] : [];
    });
  }

  goBack(){
    if(rootScope.isWeb) {
      this.location.back();
    }
  }
  
}
