import { state, style, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { SessionService } from '@src/app/service/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
  animations: [
    trigger('highlight', [
      state('on', style({ color: '#93b85f', fontWeight: '500' })),
      state('off', style({ color: '*', fontWeight: '*' }))
    ])
  ]
})
export class MypageComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  currentUrl: string;
  depth: number;
  selectedTab = '';

  constructor(
    private router: Router,
    private session: SessionService
  ) { 
    this.subscription = this.router.events.subscribe(val => {
      if(val instanceof NavigationEnd) {
        this.currentUrl = val.url;
        this.depth = this.currentUrl.split('/').length - 1;
        this.selectedTab = this.currentUrl.split('/')[2];
      }
    });
  }

  ngOnInit(): void {
    // if(!this.session.user$.value) {
    //   this.router.navigateByUrl('/main');
    // }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout(){
    this.session.signOut().then(()=> {
      this.router.navigateByUrl('/main');
    });
  }

}
