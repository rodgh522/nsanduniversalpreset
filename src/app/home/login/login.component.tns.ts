import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getString, setString } from '@nativescript/core/application-settings';
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
  srch: any = {};

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
          this.session.signIn(param.LoginId, param.Pwd, stayChecked, res.body.docs[0]).then(()=> {
            this.router.navigateByUrl('/main');
          });
        }
      }
    },
    (error)=> {
      console.error('[Error]=> ' + error);
    });
  }

  searchBooking(){
    const param = JSON.stringify(this.srch);
    this.router.navigate(['/reservation', param]);
  }

  signOut(){
    this.session.signOut();
  }

  setData(){
    setString('name', 'host');
  }

  getData(){
    console.log(getString('name'));
  }

}
