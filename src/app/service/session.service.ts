import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private auth: AngularFireAuth
  ) { }

  signUp(id: string, pwd: string){
    return this.auth.createUserWithEmailAndPassword(id + '@softzion.com', pwd);
  }

  signIn(id: string, pwd: string, stay: string){

    return this.auth.setPersistence(stay).then(()=> {
      this.auth.signInWithEmailAndPassword(id + '@softzion.com', pwd);
    });
  }
  
  signOut(){
    return this.auth.signOut();
  }
}
