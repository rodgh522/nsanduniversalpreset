import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { resvStat, rootScope } from '@src/app/global/global';
import { StaticVariableService } from '@src/app/global/static-variable';
import { PostApiService } from '@src/app/service/post-api.service';
import { SessionService } from '@src/app/service/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mybooking',
  templateUrl: './mybooking.component.html',
  styleUrls: ['./mybooking.component.scss']
})
export class MybookingComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  resvStat = resvStat;
  memId;
  list = [];
  constructor(
    private router: Router,
    private postApi: PostApiService,
    private session: SessionService,
    private staticVariable: StaticVariableService
  ) { 
    this.subscription = this.session.user$.subscribe(res=> {
      if(res) {
        this.memId = res.MemId;
        this.getList();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  getList(){
    const param = {
      uploadFileList: [],
      tableNm: 'accom',
      IdName: 'AcomId',
      mapcode: 'MovilaBooking.searchBooking',
      MemId: this.memId
    };

    this.postApi.movilaSelect(param, (res)=> {
      if(res.header.status === 200) {
        this.list = res.body.docs;
        this.list.map(a=> {
          a.photo = this.staticVariable.getFileDownloadUrl(a.uploadFileList[0].PhysicalFileNm)
        });
      }
    });
  }

  goDetail(id) {
    const param = { ResvNo: id };
    this.router.navigate(['/mypage/reservation', JSON.stringify(param)]);
  }

}
