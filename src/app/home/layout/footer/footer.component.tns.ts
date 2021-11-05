import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@src/app/service/session.service.tns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.tns.html',
  styleUrls: ['./footer.component.tns.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  subscription: Subscription;
  constructor(
    private router: Router,
    private session: SessionService
  ) { 
    this.subscription = this.session.user$.subscribe((res)=> {
      this.isLoggedIn = res ? true : false;
    });
  }

  ngOnInit(): void {
  }

  @HostListener('unloaded')
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  
  onBottomNavTap(url: string): void {
    const goTo = url !== 'login' ? url : (this.isLoggedIn ? 'mypage' : 'login');
    this.router.navigateByUrl(goTo);
  }

}
