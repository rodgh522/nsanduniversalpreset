import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formToObj, rootScope, validCheck } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { CONSTANT } from '@src/assets/global-constant';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit {

  partnerform: FormGroup
  constructor(
    private fb: FormBuilder,
    private postApi: PostApiService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.partnerform = this.fb.group({
      PartnerNm: ['', [
        Validators.required
      ]],
      President: ['', [
        Validators.required
      ]],
      Phone: ['', [
        Validators.required
      ]],
      Email: ['', [
        Validators.required
      ]],
      Addr: ['', [
      ]],
      BizNo: ['', [
        Validators.required
      ]]
    });
  }

  checkValid(target){
    return this.partnerform.controls[target].touched && !this.partnerform.controls[target].valid;
  }

  submit(){
    if(validCheck(this.partnerform.controls)){
      for(const key in this.partnerform.controls){
        if(this.partnerform.controls[key]){
          this.partnerform.controls[key].markAsTouched();
        }
      }
      return;
    }
    let data = formToObj(this.partnerform.controls);
    this.sendRequest(data);
  }

  sendRequest(data: any){

    const attr = [
      'keyId', 'PartnerNm', 'President', 'Phone', 'Email', 'Addr', 'BizNo'
    ];
    data.attr = attr;
    data.MemId = rootScope.gVariable.MemId;
    data.mapcode = 'insertPartner';
    data.idName = 'PartnerId';

    this.postApi.home(data, (res)=> {
      console.log(res);
      if(res.header.status === CONSTANT.HttpStatus.OK){
        
      }
    },
    (error)=> {
      console.error('[Error]=> ' + error);
    });
  }

}
