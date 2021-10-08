import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { changeFormat, formToObj, isNullOrEmpty, rootScope, validCheck } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  infoform: FormGroup;
  data: any;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private postApi: PostApiService
  ) { 
    this.data = rootScope.paymentData;
  }

  ngOnInit(): void {
    if(rootScope.isWeb) {
      if(isNullOrEmpty(this.data)) {
        this.location.back();
      }
    }
    this.data.rooms[0].PrintCode = '1707200342';
    this.data.rooms[0].VerifyCode = 'CMB2-L85M-J65C';
    console.log(this.data);
    this.formInit();
  }

  formInit(){
    this.infoform = this.fb.group({
      GuestNm: ['', [
        Validators.required
      ]],
      Mobile: ['', [
        Validators.required
      ]]
    })
  }

  setData(){
    if(this.isFormCompleted()) {
      return;
    }
    let form = formToObj(this.infoform.controls);
    let param: any = { ...form, ...this.data };
    param.dates = changeFormat(this.data.dates);
    console.log(param);
  }

  isFormCompleted(){
    if(validCheck(this.infoform.controls)){
      for(const key in this.infoform.controls){
        if(this.infoform.controls[key]){
          this.infoform.controls[key].markAsTouched();
        }
      }
      return true;
    }else {
      return false;
    }
  }

  searchCoupon(item) {
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

  adjCoupon(item){
    const coupon = {...item.coupon.result};
    let sleepInRow = typeof this.data.straight === 'string' ? parseInt(this.data.straight) : this.data.straight;
    const guestPrice = item.addGuestPrice / sleepInRow;
    if(coupon.CouponTy === 'PASS') {
      item.salePrice = coupon.orgPrice + guestPrice;
    }else {
      item.salePrice = coupon.Discount;
    }
    console.log(item);
  }
  
  makeLastDay(date: Date) {
    return new Date(Date.parse(date.toString()) + 1000 * 60 * 60 * 24);
  }
  
}
