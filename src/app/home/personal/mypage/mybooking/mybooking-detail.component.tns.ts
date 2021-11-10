import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { resvStat } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service.tns';
import { confirm } from '@nativescript/core/ui/dialogs';

@Component({
  selector: 'ns-mybooking-detail',
  templateUrl: './mybooking-detail.component.tns.html',
  styleUrls: ['./mybooking-detail.component.tns.scss']
})
export class MybookingDetailComponent implements OnInit {

  infoMsg1 = '결제 완료된 예약 건은 위약금 및 부분 결제 취소 등의 이유로 사용자 취소/환불이 불가능합니다.';
  infoMsg2 = '고객센터(031-932-8188) 또는 1:1 게시판에 문의 주시기 바랍니다.';
  toasted = 'hide';
  toastMsg = '';
  params;
  today = new Date();
  main: any = {};
  subs = [];
  resvStat = resvStat;

  constructor(
    private activatedRouter: ActivatedRoute,
    private postApi: PostApiService
  ){
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
      title: '예약취소',
      message: '[' + resv.RoomNm + '] 객실 예약을 취소하시겠습니까?',
      okButtonText: '예약취소',
      cancelButtonText: '닫기'
    };
    confirm(data).then(res=> {
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

    this.toasted = 'hide';
    this.postApi.movilaUpdate(param, res=>{
      if(res.header.status === 200) {
        this.toast('예약이 취소되었습니다.');
        this.getList();
      }else{
        this.toast('장애가 발생했습니다.');
      }
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
