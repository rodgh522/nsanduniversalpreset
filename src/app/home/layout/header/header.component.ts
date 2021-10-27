import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChildren } from '@angular/core';
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

  offsetY;
  outerWidth;
  mobMenuToggle = false;
  public isLoggedIn = false;
  private subscription: Array<Subscription> = [];
  constructor(
    private router: Router,
    private session: SessionService,

  ){ 

    this.subscription.push(this.session.user$.subscribe(res=> {
      this.isLoggedIn = res ? true : false;
    }));
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event){
    if(rootScope.isWeb) {
      this.offsetY = window.pageYOffset;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(e){
    if(rootScope.isWeb) {
      this.outerWidth = window.outerWidth;
    }
  }

  ngOnInit(): void {
    if(rootScope.isWeb) {
      this.offsetY = window.pageYOffset;
      this.outerWidth = window.outerWidth;
    }
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
