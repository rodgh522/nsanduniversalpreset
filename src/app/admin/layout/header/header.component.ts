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
  constructor(
    private session: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signOut(){
    this.session.signOut().then(()=> {
      this.router.navigateByUrl('/login');
    });
  }

}
