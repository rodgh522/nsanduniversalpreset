import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isLoggedIn: boolean;
  prm: Observable<boolean>;
  test;
  constructor(
    @Inject(PLATFORM_ID) private platform: any,
    private auth: AngularFireAuth
  ){
    
    this.prm = this.auth.authState.pipe(map(res => {
      return res !== null
    }));
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(isPlatformBrowser(this.platform)){
        return this.prm;
      }
  }
  
}
