import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@src/app/service/session.service';

@Component({
  selector: 'admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showBoard = false;
  user: any;
  constructor(
    private session: SessionService,
    private router: Router
  ) { 

    this.session.user.subscribe(res=> {
      this.user = res;
    });
  }

  ngOnInit(): void {
  }

  signOut(){
    this.session.signOut();
  }

}
