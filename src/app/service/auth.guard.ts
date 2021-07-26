import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isLoggedIn: boolean;
  constructor(
    @Inject(PLATFORM_ID) private platform: any,
    private auth: AngularFireAuth
  ){
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(isPlatformBrowser(this.platform)){
        return this.checkSession();
      }
  }

  async checkSession(): Promise<boolean>{
    if(!this.isLoggedIn){
      return new Promise((resolve)=> {
        this.auth.authState.subscribe((res)=> {
          if(res === null){
            this.isLoggedIn = false;
            resolve(false);
          }
          this.isLoggedIn = true;
          resolve(true);
        });
      });
    }else{
      return this.isLoggedIn;
    }
  }
  
}
