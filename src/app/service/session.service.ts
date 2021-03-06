import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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
    private auth: AngularFireAuth
  ) { 

  }

  signUp(id: string, pwd: string){
    return this.auth.createUserWithEmailAndPassword(id + '@softzion.com', pwd);
  }

  signIn(id: string, pwd: string, stay: string, info: any){
    return this.auth.setPersistence(stay).then(()=> {
      return this.auth.signInWithEmailAndPassword(id + '@softzion.com', pwd).then(()=> {
        this.user$.next(info);
        rootScope.setUserSession(info);
      });
    });
  }
  
  signOut(){
    return this.auth.signOut().then(()=> {
      this.user$.next(null);
      rootScope.sessionExpire();
    });
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
