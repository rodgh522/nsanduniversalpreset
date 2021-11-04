import { Injectable } from '@angular/core';
import { firebase, firebaseFunctions, firestore } from '@nativescript/firebase';
import { BehaviorSubject } from 'rxjs';
import { rootScope } from '../global/global';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  user$ = new BehaviorSubject(null);
  accomodation$ = new BehaviorSubject(null);
  addAcom$ = new BehaviorSubject(null);
  fireState;
  constructor(
  ) { 

  }

  signUp(id: string, pwd: string){
    // return this.auth.createUserWithEmailAndPassword(id + '@softzion.com', pwd);
  }

  signIn(id: string, pwd: string, stay: string, info: any){
    return firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {email: id + '@softzion.com', password: pwd},
    }).then((res)=> {
      this.user$.next(info);
      console.dir(res);
    }).catch(e=> {
      console.dir(e);
    });
    // return this.auth.setPersistence(stay).then(()=> {
    //   return this.auth.signInWithEmailAndPassword(id + '@softzion.com', pwd).then(()=> {
        
    //     rootScope.setUserSession(info);
    //   });
    // });
  }
  
  signOut(){
    firebase.logout().then(res=> {
      console.dir(res);
    });
    // return this.auth.signOut().then(()=> {
    //   this.user$.next(null);
    //   rootScope.sessionExpire();
    // });
  }

  setAddAcom(data: any){
    rootScope.gVariable.AcomId = data;
    sessionStorage['AcomId'] = data;
    this.addAcom$.next(data);
    this.accomodation$.next(data);
  }
  
  setAccomodation(data: any){
    sessionStorage['AcomId'] = data;
    rootScope.gVariable.AcomId = data;
    this.accomodation$.next(data);
  }
}
