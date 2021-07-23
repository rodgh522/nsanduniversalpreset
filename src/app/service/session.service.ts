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
    this.auth.createUserWithEmailAndPassword(id + '@softzion.com', pwd).then((res)=>{
      // this.user.next(res);
    });
  }

  signIn(id: string, pwd: string){
    this.auth.signInWithEmailAndPassword(id + '@softzion.com', pwd).then((res)=> {
      // this.user.next(res);
    });
  }
  
  signOut(){
    this.auth.signOut().then((res)=>{
      // this.auth.currentUser.then((user)=> {
      //   console.log(user)
      // });
    });
  }
}
