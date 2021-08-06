import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { rootScope } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { SessionService } from '@src/app/service/session.service';
import { CONSTANT } from '@src/assets/global-constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  unitList = [];
  subscriptions: Array<Subscription> = [];
  constructor(
    private postApi: PostApiService,
    private router: Router,
    private session: SessionService
  ) { 
    this.subscriptions.push(
      this.session.accomodation$.subscribe(()=> {
        this.getUnitList();
      })
    );
  }

  ngOnInit(): void {
    this.getUnitList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(a=> a.unsubscribe());
  }

  getUnitList(){
    const attr = [
      'UnitId', 'UnitNm', 'GuestStd', 'GuestMax'
    ];

    const data = {
      mapcode: 'MovilaAccomodation.getUnitList',
      attr: attr,
      useConvert : 'Y',
      AcomId: rootScope.gVariable.AcomId
    };

    this.postApi.movilaSelect(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        if (res.body.docCnt > 0) { 
          this.unitList = res.body.docs;
        }
      }
      console.log(res);
    });
  }

  goEdit(keyId){
    this.router.navigateByUrl('/admin/accom/unit-edit/' + keyId);
  }
}
