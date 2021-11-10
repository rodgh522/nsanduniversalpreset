import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@src/app/service/session.service.tns';

@Component({
  selector: 'ns-info',
  templateUrl: './info.component.tns.html',
  styleUrls: ['./info.component.tns.scss']
})
export class InfoComponent implements OnInit, OnDestroy {

  user: any = {};
  constructor(
    private router: Router,
    private session: SessionService
  ) { 
    this.user = this.session.user$.value;
  }

  ngOnInit(): void {
    console.log(this.user);
  }

  @HostListener('unloaded')
  ngOnDestroy(){
  }

  signOut(){
    this.session.signOut().then(()=> {
      this.router.navigateByUrl('/main');
    });
  }

}
