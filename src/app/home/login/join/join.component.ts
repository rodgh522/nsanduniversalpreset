import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { checkPwd, formToObj, validCheck } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { SessionService } from '@src/app/service/session.service';
import { CONSTANT } from '@src/assets/global-constant';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  joinform: FormGroup;
  pwdTip: string;
  isChecked = false;
  isDuplicated = false;

  constructor(
    private fb: FormBuilder,
    private postApi: PostApiService,
    private session: SessionService,
    private router: Router
  ) { 
    this.joinform = fb.group({
      LoginId: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern("^[a-z0-9_\-]{5,}$"),
      ]],
      Pwd: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern("^(?=.*[a-zA-Z0-9])(?=.*[a-zA-Z!`~@#$%^&*()_=+{}|?<>,./\-])(?=.*[a-z0-9!`~@#$%^&*()_=+{}|?<>,./\-])(?=.*[A-Z0-9!`~@#$%^&*()_=+{}|?<>,./\-]).{8,}$") // 대문자, 소문자, 숫자, 특수문자 중 2개조합 8자리이상
      ]],
      MemNm: ['', [
        Validators.required
      ]],
      Mobile: ['', [
        Validators.required,
        Validators.pattern('^[0-9-]{10,11}$')
      ]],
      sms: ['', [
        // Validators.required
      ]],
      rePwd: ['', [
        Validators.required,
      ]],
      agreement: ['', [
        Validators.required,
        Validators.requiredTrue
      ]],
    }, {
      validator: checkPwd('Pwd', 'rePwd')
    });

    this.pwdTip = '8 ~ 16자, 숫자 혹은 특수문자 1개 이상';
  }

  ngOnInit(): void {
  }

  checkValid(target){
    return this.joinform.controls[target].touched && !this.joinform.controls[target].valid;
  }

  checkPwd(){
    const pwd = this.joinform.controls.Pwd.value;
    const rePwd = this.joinform.controls.rePwd.value;
    if(pwd && rePwd){
      return pwd === rePwd ? false : true;
    }
    return true;
  }

  sumbit(){
    if(validCheck(this.joinform.controls)){
      for(const key in this.joinform.controls){
        if(this.joinform.controls[key]){
          this.joinform.controls[key].markAsTouched();
        }
      }
      return;
    }
    let data = formToObj(this.joinform.controls);
    if(this.isChecked){
      this.sendRequest(data);
    }
  }
  
  sendRequest(data: any){
    const attr = [
      'keyId', 'LoginId', 'Pwd', 'MemNm', 'Mobile'
    ];
    data.attr = attr;
    data.mapcode = 'movilaJoin';
    data.idName = 'MemId';

    this.postApi.login(data, (res)=> {
      if(res.header.status === CONSTANT.HttpStatus.OK){
        this.session.signUp(data.LoginId, data.Pwd).then(()=> {
          this.router.navigateByUrl('/login');
        });
      }
    },
    (error)=> {
      console.error('[Error]=> ' + error);
    });
  }

  checkDuplication(){
    const idCtrl = this.joinform.controls['LoginId'];
    if(!idCtrl.valid){
      return;
    }

    const data = {
      id: idCtrl.value,
      mapcode: 'duplicationCheck'
    };

    this.postApi.login(data, (res)=> {
      if(res.header.status === CONSTANT.HttpStatus.OK){
        if(res.body.docCnt > 0){
          if(res.body.docs[0].resultCode === 0){
            this.isChecked = true;
            this.isDuplicated = false;
          }else{
            this.isDuplicated = true;
          }
        }
      }
    },
    (error)=> {
      console.error('[Error]=> ' + error);
    });
  }
}
