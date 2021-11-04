import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { rootScope } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service.tns';
import { SessionService } from '@src/app/service/session.service.tns';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.tns.html',
  styleUrls: ['./login.component.tns.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('autoLogin') autoLogin: ElementRef;
  formData: any = {};
  tab = 0;
  valid: any = {
    id: false,
    pwd: false,
    member: false,
    iofo: false
  };

  constructor(
    private postApi: PostApiService,
    private router: Router,
    private session: SessionService
  ) { }

  ngOnInit(): void {
  }

  onCheck(){
    this.autoLogin.nativeElement.checked = this.formData.autoLogin = this.formData.autoLogin ? false : true;
  }

  doLogin(){
    if(this.formData.LoginId === undefined || this.formData.LoginId === ''){
      this.valid.id = true;
      return;
    }else if(this.formData.Pwd === undefined || this.formData.Pwd === '') {
      this.valid.pwd = true;
      return;
    }else{
      this.sendRequest();
    }
  }

  SearchBooking(){

  }

  sendRequest(){
    const config = {
      mapcode: 'movilaLogin',
      attr: [
        'MemId', 'PartnerId', 'MemTy', 'MemNm', 'LoginId', 'Mobile', 'Email'
      ]
    };
    const param = {...this.formData, ...config};

    this.postApi.login(param, (res)=> {
      if(res.header.status === 200){
        if(res.body.docCnt > 0){
          const stayChecked = this.formData.autoLogin ? 'local' : 'session';
          this.session.signIn(param.LoginId, param.Pwd, stayChecked, {}).then(()=> {
            this.router.navigateByUrl('/main');
          });
        }
      }
    },
    (error)=> {
      console.error('[Error]=> ' + error);
    });
  }

  signOut(){
    this.session.signOut();
  }

}
