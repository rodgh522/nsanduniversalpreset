import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { changeFormat, formToObj, isNullOrEmpty, rootScope, validCheck } from '@src/app/global/global';

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
    private fb: FormBuilder
  ) { 
    this.data = rootScope.paymentData;
  }

  ngOnInit(): void {
    if(rootScope.isWeb) {
      if(isNullOrEmpty(this.data)) {
        this.location.back();
      }
    }

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

}
