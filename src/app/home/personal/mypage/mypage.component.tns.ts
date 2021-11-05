import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@src/app/service/session.service.tns';

@Component({
  selector: 'ns-mypage',
  templateUrl: './mypage.component.tns.html',
  styleUrls: ['./mypage.component.tns.scss']
})
export class MypageComponent implements OnInit {

  constructor(
    private session: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signOut(){
    this.session.signOut().then(()=> {
      this.router.navigateByUrl('/main');
    });
  }

}
