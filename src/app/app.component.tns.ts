import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/* Firebase */
import { firebase } from '@nativescript/firebase';
import { SearchService } from './service/search.service';
import { SessionService } from './service/session.service.tns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.tns.html',
  styleUrls: ['./app.component.tns.scss']
})
export class AppComponent implements OnInit{

  constructor(
    private session: SessionService,
    private searchService: SearchService,
    private router: Router
  ) {
    const srch = {
      GuestMax: "2",
      dates: [new Date()],
      straight: "1",
      Sido: [],
    }
    this.searchService.srch = srch;
  }
  
  ngOnInit(){
    firebase.getCurrentUser().then(res=> {
      this.session.getAppStorage();
    }).catch(res=> {
      this.initFireBase();
    });
    this.router.navigateByUrl('/main');
  }

  initFireBase(){
    firebase.init({
      persist: true
    }).then((res)=> {
      console.log(res);
    });
  }

}
