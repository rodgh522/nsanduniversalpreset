import { Component, OnInit } from '@angular/core';
/* Firebase */
import { firebase } from '@nativescript/firebase';

import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.tns.html',
  styleUrls: ['./app.component.tns.scss']
})
export class AppComponent implements OnInit{

  ngOnInit(){
    firebase.getCurrentUser().then(res=> {
      console.dir('current user ====>', res);
    }).catch(res=> {
      console.dir('no user ===>', res);
      this.initFireBase();
    })
  }

  initFireBase(){
    firebase.init({
      persist: false
    }).then((res)=> {
      console.log(res);
    });
  }

}
