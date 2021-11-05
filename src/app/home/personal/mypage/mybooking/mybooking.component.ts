import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  memId;
  constructor(
    private router: Router,
    private postApi: PostApiService,
    private session: SessionService
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
      mapcode: 'MovilaBooking.searchBooking',
      MemId: this.memId
    };

    this.postApi.movilaSelect(param, (res)=> {
      console.log(res);
    });
  }

}
