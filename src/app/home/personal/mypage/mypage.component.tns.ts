import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@src/app/service/session.service.tns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-mypage',
  templateUrl: './mypage.component.tns.html',
  styleUrls: ['./mypage.component.tns.scss']
})
export class MypageComponent implements OnInit {

  subscription: Subscription;
  user: any = {};
  constructor(
    private session: SessionService,
    private router: Router
  ) { 
    
    this.subscription = this.session.user$.subscribe((res)=> {
      this.user = res;
    });
  }

  ngOnInit(): void {
  }

  @HostListener('unloaded')
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
