import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/* Firebase */
import { firebase } from '@nativescript/firebase';
import { SessionService } from './service/session.service.tns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.tns.html',
  styleUrls: ['./app.component.tns.scss']
})
export class AppComponent implements OnInit{

  constructor(
    private session: SessionService,
    private router: Router
  ) {

  }
  
  ngOnInit(){
    firebase.getCurrentUser().then(res=> {
      this.session.getAppStorage();
    }).catch(res=> {
      this.initFireBase();
    });
    // this.router.navigateByUrl('/booking');
    const param = { ResvNo: 'TTPAPM' };
    this.router.navigate(['/reservation', JSON.stringify(param)]);
  }

  initFireBase(){
    firebase.init({
      persist: true
    }).then((res)=> {
      console.log(res);
    });
  }

}
