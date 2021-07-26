import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { rootScope } from '../global/global';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  user = new BehaviorSubject(null);
  
  constructor(
    private auth: AngularFireAuth
  ) { }

  signUp(id: string, pwd: string){
    return this.auth.createUserWithEmailAndPassword(id + '@softzion.com', pwd);
  }

  signIn(id: string, pwd: string, stay: string, info: any){
    this.user.next(info);
    
    rootScope.setUserSession(info);

    return this.auth.setPersistence(stay).then(()=> {
      this.auth.signInWithEmailAndPassword(id + '@softzion.com', pwd);
    });
  }
  
  signOut(){
    this.user.next(null);
    rootScope.sessionExpire();
    
    return this.auth.signOut();
  }
}
