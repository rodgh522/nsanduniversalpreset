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
  styleUrls: ['./accom.component.scss']
})
export class AccomComponent implements OnInit, OnDestroy {

  title = '숙소관리';
  subScription: Array<Subscription> = [];
  constructor(
    private dialog: DialogService,
    private postApi: PostApiService,
    private session: SessionService,
    private router: Router,
  ) { 
    this.subScription.push(this.session.accomodation$.subscribe(res=> {

    }));

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
      'AcomId', 'AcomNm'
    ];

    const data = {
      attr: attr,
      mapcode: 'MovilaAccomodation.getAcomInfo',
      useConvert: 'Y',
      PartnerId: rootScope.gVariable.PartnerId
    };
  }

}
