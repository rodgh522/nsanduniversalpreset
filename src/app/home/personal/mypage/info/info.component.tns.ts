import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostApiService } from '@src/app/service/post-api.service.tns';
import { SessionService } from '@src/app/service/session.service.tns';

@Component({
  selector: 'ns-info',
  templateUrl: './info.component.tns.html',
  styleUrls: ['./info.component.tns.scss'],
})
export class InfoComponent implements OnInit, OnDestroy {

  user: any = {};
  toasted = 'hide';
  toastMsg = '';
  constructor(
    private router: Router,
    private session: SessionService,
    private postApi: PostApiService,
  ) { 
    this.user = this.session.user$.value;
  }

  ngOnInit(): void {
  }

  @HostListener('unloaded')
  ngOnDestroy(){
  }

  doSubmit(){
    if(this.user['MemNm'] === ''){
      return;
    }

    this.sendRequest();
  }

  sendRequest() {
    const param = {
      mapcode: 'MovilaMember.updateMember',
      ...this.user
    };
    this.toasted = 'hide';
    this.postApi.movilaUpdate(param, (res)=> {
      if(res.header.status === 200) {
        this.toast('저장되었습니다.');
      }else{
        this.toast('저장되지 않았습니다.');
      }
    });
  }
  
  signOut(){
    this.session.signOut().then(()=> {
      this.router.navigateByUrl('/main');
    });
  }

  toast(msg: string){
    if(!msg) {
      return;
    }
    this.toastMsg = msg;
    this.toasted = 'show';
  }
}
