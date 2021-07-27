import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { objToForm, rootScope } from '@src/app/global/global';
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
  user: any;
  constructor(
    private session: SessionService,
    private router: Router,
    private postApi: PostApiService
  ) { 

    this.session.user.subscribe(res=> {
      this.user = res;
      this.getPartnerInfo();
    });
  }

  ngOnInit(): void {
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
    },
    (error)=> {
      console.error('[Error]=> ' + error);
    })
  }

}
