import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formToObj, ValidatorsExt, validCheck } from '@src/app/global/global';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  joinform: FormGroup;
  pwdTip: string;

  constructor(
    private fb: FormBuilder
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
        ValidatorsExt.checkPwd
      ]],
      agreement: ['', [
        Validators.required,
        Validators.requiredTrue
      ]],
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
    console.log(data);
  }
  
}
