import { state, style, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rootScope } from '@src/app/global/global';
import { DialogService } from '@src/app/service/dialog.service';
import { PostApiService } from '@src/app/service/post-api.service';
import { SessionService } from '@src/app/service/session.service';
import { CONSTANT } from '@src/assets/global-constant';
import { Subscription } from 'rxjs';
import { AddComponent } from './add/add.component';

@Component({
  selector: 'app-accom',
  templateUrl: './accom.component.html',
  styleUrls: ['./accom.component.scss'],
  animations: [
    trigger('focusTab', [
      state('focused', style({'backgroundColor': 'rgba(25, 115, 232, 0.1)', 'color': '#0a43ff'})),
      state('focusout', style({'backgroundColor': '*', 'color': '*'}))
    ])
  ]
})
export class AccomComponent implements OnInit, OnDestroy {

  title = '숙소관리';
  subScription: Array<Subscription> = [];
  accomInfo: any = {
    options: []
  };
  container;
  selectedTab = 0;
  constructor(
    private dialog: DialogService,
    private postApi: PostApiService,
    private session: SessionService,
    private router: Router,
  ) { 
    
    this.subScription.push(this.session.accomodation$.subscribe(res=> {
      this.getAcomInfo();
    }));
    this.container = rootScope.windowSize;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subScription.forEach(a => a.unsubscribe());
  }

  openAdd(){
    this.dialog.slide(AddComponent, {data: ''});
  }

  operateTab(e){
    switch(e){
      case 1:
        this.router.navigateByUrl('/admin/accom/unit-list');
      break;
    }
  }

  getAcomInfo(){
    const attr = [
      'AcomId', 'AcomNm', 'AcomStat', 'AcomTy', 'Address', 'Line', 'CheckinTime', 'CheckoutTime', 'Intro'
    ];

    const data = {
      attr: attr,
      mapcode: 'getAccom',
      useConvert: 'Y',
      PartnerId: rootScope.gVariable.PartnerId,
      AcomId: rootScope.gVariable.AcomId
    };

    this.postApi.home(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        if (res.body.docCnt > 0) {
          this.accomInfo = res.body.docs[0];
        }
      }
    });
  }

}
