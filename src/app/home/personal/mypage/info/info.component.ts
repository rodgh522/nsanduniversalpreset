import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formToObj, objToForm, validCheck } from '@src/app/global/global';
import { DialogService } from '@src/app/service/dialog.service';
import { PostApiService } from '@src/app/service/post-api.service';
import { SessionService } from '@src/app/service/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {

  infoForm: FormGroup;
  user;
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private session: SessionService,
    private postApi: PostApiService,
    private dialog: DialogService
  ) { 

    this.subscription = this.session.user$.subscribe((res)=> {
      if(res){
        console.log(res);
        this.user = res;
        this.initForm();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  initForm(){
    this.infoForm = this.fb.group({
      MemNm: [this.user.MemNm, [Validators.required]],
      Mobile : new FormControl({value: this.user.Mobile, disabled: true}),
      Email: [this.user.Email, []],
      ContractCode: [this.user.ContractCode, []],
      ZipCode : new FormControl({value: this.user.ZipCode, disabled: true}),
      Addr1 : new FormControl({value: this.user.Addr1, disabled: true}),
      Addr2: [this.user.Addr2, []]
    });
  }

  srchAddr(){
    new daum.Postcode({
      oncomplete: (data)=> {
        const addr = '[' + data.zonecode + '] ' + data.address;
        this.infoForm.controls['ZipCode'].setValue(data.zonecode);
        this.infoForm.controls['Addr1'].setValue(data.address);

        // this.formPage1.controls['Address'].setValue(addr);
      },
    }).open();
  }

  doSubmit(){
    if(this.infoForm.controls['MemNm'].value === ''){
      return;
    }

    this.sendRequest();
  }

  sendRequest() {
    const param = {
      ...formToObj(this.infoForm.controls),
      mapcode: 'MovilaMember.updateMember',
      MemId: this.user.MemId
    };
    this.postApi.movilaUpdate(param, (res)=> {
      if(res.header.status === 200) {
        this.dialog.toast('저장되었습니다.');
      }else{
        this.dialog.toast('저장되지 않았습니다.');
      }
    });
  }
}
