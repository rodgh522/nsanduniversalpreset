import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { resvStat } from '@src/app/global/global';
import { StaticVariableService } from '@src/app/global/static-variable.tns';
import { PostApiService } from '@src/app/service/post-api.service.tns';
import { SessionService } from '@src/app/service/session.service.tns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-mybooking',
  templateUrl: './mybooking.component.tns.html',
  styleUrls: ['./mybooking.component.tns.scss']
})
export class MybookingComponent implements OnInit, OnDestroy {

  infoMsg1 = '결제 완료된 예약 건은 위약금 및 부분 결제 취소 등의 이유로 사용자 취소/환불이 불가능합니다.';
  infoMsg2 = '고객센터(031-932-8188) 또는 1:1 게시판에 문의 주시기 바랍니다.';

  subscription: Subscription;
  resvStat = resvStat;
  list = [];
  memId;
  constructor(
    private router: Router,
    private session: SessionService,
    private postApi: PostApiService,
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

  @HostListener('unloaded')
  ngOnDestroy(){
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
    this.router.navigate(['/reservation', JSON.stringify(param)]);
  }
}
