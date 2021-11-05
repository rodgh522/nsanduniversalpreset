import { Injectable } from '@angular/core';
import { getString, setString } from '@nativescript/core/application-settings';
import { firebase, firebaseFunctions, firestore } from '@nativescript/firebase';
import { BehaviorSubject } from 'rxjs';
import { rootScope } from '../global/global';

const userInfoDefaultSet = {
  ContractCode: '',
  ContractNm: "",
  MemNm: "",
  MemId: "",
  ChCode: "",
  Mobile: ""
};
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
    }).then(()=> {
      console.dir(info);
      this.setAppStorage(info);
      this.user$.next(info);
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
    return firebase.logout().then(()=> {
      this.user$.next(undefined);
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

  setAppStorage(userInfo: any){
    for(const key in userInfo) {
      setString(key, userInfo[key]);
    }
  }

  getAppStorage(){
    let user: any = {};
    for(const key in userInfoDefaultSet) {
      user[key] = getString(key);
    }
    this.user$.next(user);
  }
}
