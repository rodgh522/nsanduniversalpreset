import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formToObj, validCheck } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { SessionService } from '@src/app/service/session.service';
import { CONSTANT } from '@src/assets/global-constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginform: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postApi: PostApiService,
    private session: SessionService,
    private router: Router
  ) { 

    this.loginform = fb.group({
      LoginId: ['', [
        Validators.required
      ]],
      Pwd: ['', [
        Validators.required
      ]],
      stayChecked: [true, []]
    });
  }

  ngOnInit(): void {
  }

  signIn(){
    if(validCheck(this.loginform.controls)){
      for(const key in this.loginform.controls){
        if(this.loginform.controls[key]){
          this.loginform.controls[key].markAsTouched();
        }
      }
      return;
    }

    this.sendRequest();
  }

  sendRequest(){
    const config = {
      mapcode: 'movilaLogin',
      attr: [
        'MemId', 'PartnerId', 'MemTy', 'MemNm', 'LoginId', 'Mobile', 'Email'
      ]
    };
    let data = formToObj(this.loginform.controls);
    data = {...data, ...config};

    this.postApi.login(data, (res)=> {
      if(res.header.status === CONSTANT.HttpStatus.OK){
        if(res.body.docCnt > 0){
          const stayChecked = this.loginform.controls['stayChecked'].value ? 'local' : 'session';
          this.session.signIn(data.LoginId, data.Pwd, stayChecked, res.body.docs[0]).then(()=> {
            this.router.navigateByUrl('/admin');
          });
        }
      }
    },
    (error)=> {
      console.error('[Error]=> ' + error);
    });
  }

  checkValid(target){
    return this.loginform.controls[target].touched && !this.loginform.controls[target].valid;
  }

}
