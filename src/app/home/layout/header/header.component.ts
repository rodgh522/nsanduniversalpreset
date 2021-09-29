import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { rootScope } from '@src/app/global/global';
import { SessionService } from '@src/app/service/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isLoggedIn = false;
  private subscription: Array<Subscription> = [];
  constructor(
    private router: Router,
    private session: SessionService
  ){ 

    this.subscription.push(this.session.user$.subscribe(res=> {
      this.isLoggedIn = res ? true : false;
    }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subscription.forEach(a=> a.unsubscribe());
  }

  goLogin(){
    rootScope.savedUrl = this.router.url;
    this.router.navigateByUrl('login');
  }

  logout(){
    this.session.signOut();
  }
  
}
