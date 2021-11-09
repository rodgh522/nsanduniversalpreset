import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { resvStat } from '@src/app/global/global';
import { DialogService } from '@src/app/service/dialog.service';
import { PostApiService } from '@src/app/service/post-api.service';

@Component({
  selector: 'app-mybooking-detail',
  templateUrl: './mybooking-detail.component.html',
  styleUrls: ['./mybooking-detail.component.scss']
})
export class MybookingDetailComponent implements OnInit {

  today = new Date();
  params;
  resvStat = resvStat;
  main: any = {};
  subs = [];
  constructor(
    private router: Router,
    private postApi: PostApiService,
    private activatedRouter: ActivatedRoute,
    private dialog: DialogService
  ) { 
    const json = this.activatedRouter.snapshot.params.param;
    if(json) {
      this.params = JSON.parse(json);
    }
  }

  ngOnInit(): void {
    this.getList();
  }

  getList(){
    const param = {
      ...this.params,
      mapcode: 'searchBookingDetail',
    };

    this.postApi.home(param, (res)=> {
      if(res.header.status === 200) {
        const list = res.body.docs;
        list.forEach(a=> {
          a.availableCancle = this.checkCancleAvailable(a.CheckinDt, a.ResvStat);
        });
        this.main = list.filter(a=> a.ResvNo === param.ResvNo)[0];
        this.subs = list.filter(b=> b.ResvNo !== param.ResvNo);
      }
    });
  }

  calcOptionTotal(opts){
    if(!opts) {
      return;
    }
    let total = 0;
    opts.forEach(a=> {
      if(a.Paid === 'Y') {
        total += a.ItemPrice * a.Amount
      }
    });
    return total;
  }

  calcCouponTotal(coupons) {
    if(!coupons){
      return;
    }
    let total = 0;
    coupons.forEach(a=> {
      total += a.PromoPrice;
    });
    return total;
  }
  
  /**
   * 예약취소 가능여부 체크
   * @param utc: DB의 UTC 데이터
   *       stat: 예약상태
   * 
   * Date함수로 초기화하여 해당날짜의 00시와 오늘 00시와 비교,
   * 예약대기, 예약완료만 취소가능
   *  */
  checkCancleAvailable(utc, stat) {
    const date = new Date(utc);
    const today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    const dDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateAvailable = dDay >= today;

    const statAvailable = stat === 'WAIT' || stat === 'COMP';

    return dateAvailable && statAvailable;
  }
  
  cancelBooking(resv: {[key: string]: any}){
    const data = {
      msg: '[' + resv.RoomNm + '] 객실 예약을 취소하시겠습니까?',
      ok: {
        msg: '예약취소'
      },
      cancel: {
        msg: '닫기'
      }
    };
    this.dialog.confirm(data).toPromise().then(res=> {
      if(res) {
        this.sendRequest(resv);
      }
    });
  }

  sendRequest(resv: any) {
    const param = {
      mapcode: 'Reservation.updateBookingStat',
      ResvNo: resv.ResvNo,
      ResvStat: 'REQS'
    };

    this.postApi.movilaUpdate(param, res=>{
      if(res.header.status === 200) {
        this.getList();
      }
    });
  }

}
