import { HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { CONSTANT } from '../../assets/global-constant';
import { rootScope } from './global';
//import { GAlert } from '@src/app/component/gAlert/service';

@Injectable({
  providedIn: 'root'
})
export class StaticVariableService{

  public getRequestActions: any;
  constructor(
    //public gAlert : GAlert
    ) {
    CONSTANT.URL.CONTEXT = this.getContextPath();

    let alreadyOccurError = false;
    let serverDead = false;

    let intercept = {
      response : function(JSON) {
        //console.info('intercept JSON=====', JSON);
        return JSON.data;
      },
      responseError : (error) => {
        console.log('intercept error=====', error);

        if (error.data == null) {
        //  this.gAlert.alert('Menu.SERVERERROR4', "Unknown error.");
          return null;
        }

        if ((error.status == -1 || error.status == 400) && !serverDead) {
          serverDead = true;
          // this.gAlert.alert('Menu.SERVERERROR1', {
          //   fn : function() {
          //     this.sessionExpire();
          //     // $state.go('login');
          //   }
          // });

        } else if (error.data && error.data.response === undefined) {
          // this.gAlert.alert('Menu.SERVERERROR2', error.statusText, {
          //   fn : function() {
          //     console.error('server Error', '[' + error.status + ']' + error.statusText);
          //     if (error.status == 401 || error.status == 400) {
          //       this.sessionExpire();
          //       // $state.go('login');
          //     }
          //   }
          // });
          return null;
        } else if (error.data.response.body.docs.errCode == 'ACN0N01-401' || error.data.response.body.docs.errCode == 'ACN1N01-401'
            || error.data.response.body.docs.errCode == 'ACN1N02-401' || error.data.response.body.docs.errCode == 'ACN1N03-401'
            || error.data.response.body.docs.errCode == 'ACN1N04-401') {
          // if(sessionStorage.isLoggedIn) {
          //   alreadyOccurError = true;
          //   this.sessionExpire();
          //   // $state.go('login');
          //   return null;
          // }
        } else if (error.data.response.body.docs.errCode === 'ACN1N00-403') {
          console.log(error.data);
          // this.gAlert.alert('Menu.SERVERERROR3', error.data.response.body.docs.errMessage, {
          //   fn : function() {
          //     console.error(error.data.response.body.docs.errMessage);
          //     // $state.go('login');
          //   }
          // });
          return null;
        } else {
          return error.data;
        }

        //this.gAlert.alert('Menu.SERVERERROR4', error.data.response.body.docs.errMessage);
        console.error(error.data.response.body.docs.errCode, error.data.response.body.docs.errMessage);
      }
    };

    this.getRequestActions = {
      defaultAction: function(){
        return {
          headers : new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
        };
      },
      getStandardAction : function() {
        return {
          getOne : {
            method : 'GET',
            headers : {
              'Content-Type' : 'application/json'
            },
            interceptor : intercept,
          },
          getList : {
            method : "GET",
            headers : {
              'Content-Type' : 'application/json'
            },
            interceptor : intercept,
          },
          create : {
            method : "POST",
            headers : {
              'Content-Type' : 'application/json'
            },
            interceptor : intercept,
          },
          modify : {
            method : "PUT",
            headers : {
              'Content-Type' : 'application/json'
            },
            interceptor : intercept,
          },
          remove : {
            method : "DELETE",
            headers : {
              'Content-Type' : 'application/json'
            },
            interceptor : intercept,
          },
        };
      },
    };
  }

  getContextPath() {
    // var offset=location.href.indexOf(location.host)+location.host.length;
    // if (offset + 1 >= location.href.length)
    //   return "";

    // var offset2 = location.href.indexOf('/',offset+1);
    // if (offset2 == -1) offset2 = location.href.length;

    // var ctxPath=location.href.substring(offset+1, offset2);

    // if (ctxPath == '#' || ctxPath == 'i.html#' || ctxPath == 'm.html#' || ctxPath == 'min.html#' || ctxPath == 'i.html' || ctxPath == 'm.html' || ctxPath == 'min.html')
    //   ctxPath = '';

    // return ctxPath;
    return '';
  }

  getUrl1(uri: string) {
    const wildcard = uri.indexOf('download.do?fileName') > -1 ? '&' : '?';
    var domainPort = CONSTANT.URL.PORT == null || CONSTANT.URL.PORT == "" ? "" : ":" + CONSTANT.URL.PORT;
    var domainContext = CONSTANT.URL.CONTEXT == null || CONSTANT.URL.CONTEXT == "" ? "" : '/' + CONSTANT.URL.CONTEXT;
    var domainVersion = CONSTANT.URL.VERSION == null || CONSTANT.URL.VERSION == "" ? "" : '/' + CONSTANT.URL.VERSION;

    var url = CONSTANT.URL.HTTP_PROTOCOL + '//' +
    CONSTANT.URL.API_SERVER_DOMAIN + domainPort +
    domainVersion + uri + wildcard + 'userkey=' + rootScope.gVariable.userkey;

    //var url = domainContext + domainVersion + uri;
    return url;
  }

  getUrl2(uri: string) {
    var domainPort = CONSTANT.URL.PORT == null || CONSTANT.URL.PORT == "" ? "" : ":" + CONSTANT.URL.PORT;
    var domainContext = CONSTANT.URL.CONTEXT == null || CONSTANT.URL.CONTEXT == "" ? "" : '/' + CONSTANT.URL.CONTEXT;
    var domainVersion = CONSTANT.URL.VERSION == null || CONSTANT.URL.VERSION == "" ? "" : '/' + CONSTANT.URL.VERSION;

    var url = CONSTANT.URL.HTTP_PROTOCOL + '//' +
    CONSTANT.URL.API_SERVER_DOMAIN + domainPort +
    domainVersion + uri;

    //var url = domainContext + domainVersion + uri;
    return url;
  }

  getFileDownloadUrl(FileKey) {
    return this.getUrl1('/attach/file/' + FileKey + '/download.do');
  }

  getDateFormat(langCode, useDateTime) {
    let format: string;
    switch (langCode) {
      case 'ko':
        format = 'yyyy.MM.dd';
        break;
      case 'zh':
        break;
      case 'ja':
        format = 'yyyy.MM.dd';
        break;
      case 'en':
        format = 'MM/dd/yy';
        break;
      default:
        format = 'MM/dd/yy';
        break;
    }
    return useDateTime ? format + ' HH:mm:ss' : format;
  }
}
