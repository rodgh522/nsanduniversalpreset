import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrEmpty, objToForm, rootScope } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { SessionService } from '@src/app/service/session.service';
import { CONSTANT } from '@src/assets/global-constant';

@Component({
  selector: 'admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showBoard = false;
  targetAcom;
  accomList = [];
  user: any;
  constructor(
    private session: SessionService,
    private router: Router,
    private postApi: PostApiService
  ) { 

    this.session.user$.subscribe(res=> {
      this.user = res;
      this.getPartnerInfo();
    });

    this.session.addAcom$.subscribe(res=> {
      this.getAcomInfo();
      this.targetAcom = res;
    });
  }

  ngOnInit(): void {
    this.getAcomInfo();
  }

  signOut(){
    this.session.signOut();
  }

  getPartnerInfo(){
    const attr = [
      'PartnerId', 'PartnerStat', 'PartnerNm', 'President', 'Phone', 'Email', 'Addr', 'BizNo'
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
          rootScope.setGVariable(res.body.docs[0]);
        }
      }
      console.log(rootScope.gVariable);
    });
  }

  getAcomInfo(){
    const attr = [
      'AcomId', 'AcomNm'
    ];

    const data = {
      attr: attr,
      mapcode: 'MovilaAccomodation.getAcomInfo',
      useConvert: 'Y',
      PartnerId: rootScope.gVariable.PartnerId
    };

    this.postApi.movilaSelect(data, (res)=> {
      if(res.header.status === CONSTANT.HttpStatus.OK){
        if(res.body.docCnt > 0){
          this.accomList = res.body.docs;
          if(isNullOrEmpty(rootScope.gVariable.AcomId)){
            this.targetAcom = rootScope.gVariable.AcomId = this.accomList[0].AcomId;
          }
        }
      }
    });
  }

  changeAccom(){
    this.session.setAccomodation(this.targetAcom);
  }

}
