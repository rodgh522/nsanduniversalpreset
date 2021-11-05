import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { SessionService } from '@src/app/service/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  currentUrl: string;
  depth: number;

  constructor(
    private router: Router,
    private session: SessionService
  ) { 
    this.subscription = this.router.events.subscribe(val => {
      if(val instanceof NavigationEnd) {
        this.currentUrl = val.url;
        this.depth = this.currentUrl.split('/').length - 1;
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
