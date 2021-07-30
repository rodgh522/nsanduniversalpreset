import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formToObj, objToForm, rootScope, validCheck } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { CONSTANT } from '@src/assets/global-constant';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit {

  partnerform: FormGroup;
  exposeSubmit = rootScope.gVariable.PartnerId ? false : true;
  uploadFileList = [];
  refreshFile = 0;
  
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

  /* 첨부파일 컴포넌트와 데이터 sync */
  syncFileList(e){
    this.uploadFileList = [...e];
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
    this.sendRequest();
  }
  
  sendRequest(){
    
    const attr = [
      'keyId', 'PartnerNm', 'President', 'Phone', 'Email', 'Addr', 'BizNo'
    ];
    const data = {
      attr : attr,
      MemId : rootScope.gVariable.MemId,
      uploadFileList : this.uploadFileList,
      IdName : 'PartnerId',
      tableNm : 'partner',
      mapcode : 'insertPartner',
      idName : 'PartnerId',
      ...formToObj(this.partnerform.controls)
    };

    this.postApi.home(data, (res)=> {
      console.log(res);
      if(res.header.status === CONSTANT.HttpStatus.OK){
        
      }
    });
  }

  operateTab(e){
    switch(e){
      case 0 : 
      break;
      case 1: this.getPartnerInfo();
      break;
    }
  }

  getPartnerInfo(){
    
    const attr = [
      'PartnerId', 'PartnerNm', 'President', 'Phone', 'Email', 'Addr', 'BizNo'
    ];
    const data = {
      attr: attr,
      mapcode: 'MovilaPartner.selectPartner',
      useConvert : 'Y',
      PartnerId: rootScope.gVariable.PartnerId
    };

    this.postApi.movilaSelect(data, (res)=> {
      if(res.header.status === CONSTANT.HttpStatus.OK){
        if(res.body.docCnt > 0){
          this.partnerform.controls = objToForm(res.body.docs[0], this.partnerform.controls);
        }
      }
      console.log(res);
    })
  }

}
