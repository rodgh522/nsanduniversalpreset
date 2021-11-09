import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostApiService } from '@src/app/service/post-api.service';

@Component({
  selector: 'app-mybooking-detail',
  templateUrl: './mybooking-detail.component.html',
  styleUrls: ['./mybooking-detail.component.scss']
})
export class MybookingDetailComponent implements OnInit {

  params;
  main: any = {};
  subs = [];
  constructor(
    private router: Router,
    private postApi: PostApiService,
    private activatedRouter: ActivatedRoute
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
}
