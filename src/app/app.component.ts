import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { rootScope } from './global/global';
import { StaticVariableService } from './global/static-variable';
import { SessionService } from './service/session.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isWeb: boolean;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private session: SessionService,
    public http: HttpClient,
    public staticVariable: StaticVariableService,
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platform: any
    ){
    this.isWeb = isPlatformBrowser(this.platform);
    
    if(this.isWeb){
      this.auth.authState.subscribe((res)=> {
        if(res === null){
          this.router.navigateByUrl('/login');
        }else{
          const user = rootScope.sessionStroageToData();
          this.session.user$.next(user);
        }
      });
    }
  }

  ngOnInit(){
    this.translate.use('ko');
  }

}
