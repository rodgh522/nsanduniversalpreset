import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rootScope } from '@src/app/global/global';
import { StaticVariableService } from '@src/app/global/static-variable';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {

  type: {[key: string]: any};
  ajax: {[key: string]: any};

  constructor(public http: HttpClient, public staticVariable: StaticVariableService) {
    this.type = {
      select : 'select', insert : 'insert', update : 'update', delete : 'delete',
      action : 'action', attach : 'attach', excel : 'excel', api : 'api',
      openApi : 'openapi', login : 'login',
    };
  }

  makeData(d: any) {
    if(rootScope.isWeb){
      if(sessionStorage['loginTenantId'] != '' && sessionStorage['loginTenantId'] != null && sessionStorage['loginTenantId'] != undefined){
        d.userkey = rootScope.gVariable.userkey;
      }
      if (sessionStorage['sysAdminYN'] == 'Y') {
        d.srchTenantId = rootScope.gVariable.srchTenantId;
      }
      d.userkey = rootScope.gVariable.userkey;
    }
    return d;
  }

  makeErrorMsg(errorType) {
    let result: any = {};
    if(errorType == 'undefinedSqlMap'){
      result.header = {status:405, msg: 'This service requires a \'mapCode\' key for data.'};
    }
    result.body = {};
    console.error(result.header);
    return result;
  }

  makeResultData(d: any){
    let result: any = {};
    if(d == null || d.responseVO == null){
      return result;
    }
    result.header = d.responseVO.header;
    result.body = d.responseVO.body;
    return result;
  }

  getMapCode(d: any) {
    var obj: any = {result : false, mapcode : ''};
    for( var key in d ){
      if(key.toLowerCase() == 'mapcode') {
        obj.result = true;
        obj.mapcode =  d[key];
        obj.data = d;
        delete obj.data.mapCode;
      }
    }
    return obj;
  }

  sendPost(p1, p2, p3, callback, callback2?) {
    this.http.post(this.staticVariable.getUrl('/'+ p1 +'/' + p2  + '/action.json'), this.makeData(p3),
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      callback(this.makeResultData(data), p2);
    },
    (error)=>{
      callback2(error, p2);
    });
  }

  sendPostOpen(p1, p2, p3, callback, callback2) {
    this.http.post(this.staticVariable.getUrl('/'+ p1 +'/' + p2  + '.json'), this.makeData(p3),
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      callback(this.makeResultData(data));
    },
    (error)=> {
      callback2(error);
    });
  }

  sendPostCustom(p1, p2, p3, callback, callback2) {
    this.http.post(this.staticVariable.getUrl('/'+ p1 +'/' + p2  + '/actionCustom.json'), this.makeData(p3),
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      callback(this.makeResultData(data));
    },
    (error)=> {
      callback2(error);
    });
  }

  sendPostApi(p1, p2, p3, callback, callback2) {
    this.http.post(this.staticVariable.getUrl('/'+ p1 +'/' + p2  + '.json'), this.makeData(p3),
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      callback(this.makeResultData(data));
    },
    (error)=> {
      callback2(error);
    });
  }

  sendOpenPostApi(p1, p2, callback, callback2) {
    this.http.post(this.staticVariable.getUrl(p1), this.makeData(p2),
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      callback(this.makeResultData(data));
    },
    (error)=> {
      callback2(error);
    });
  }

  login(p1, p2, callback?, callback2?) {
    if(typeof p1 == 'string') {
        this.sendPostOpen(this.type.login, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      const code = this.getMapCode(p1);
      if(code.result) {
        this.sendPostOpen(this.type.login, code.mapcode, code.data, (data: any)=>{
          p2(data);
        },
        (data: any)=> {
          callback(data);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  select(p1, p2, callback?, callback2?) {
    if(Array.isArray(p1)) {
      for(const i of p1){
        this.sendPost(this.type.select, i.mapCode, i.param, (data: any, mapCode: string)=> {
          data.mapCode = mapCode; p2(data);
        });
      }
    } else {
      if(typeof p1 == 'string') {
          this.sendPost(this.type.select, p1, p2, (data: any)=> {
            callback(data);
          },
          (data: any)=> {
            callback2(data);
          });
      } else {
        var code = this.getMapCode(p1);
        if(code.result) {
          this.sendPost(this.type.select, code.mapcode, code.data, (data: any)=> {
            p2(data);
          },
          (data: any)=> {
            callback(data);
          });
        }else{
          p2(this.makeErrorMsg('undefinedSqlMap'));
        }
      }
    }
  }

  callbackSelect(p1, p2, tempData, callback?, callback2?) {
    if(typeof p1 == 'string') {
        this.sendPost(this.type.select, p1, p2, (data: any)=> {
          callback(data, tempData);
        },
        (data: any)=> {
          callback2(data, tempData);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPost(this.type.select, code.mapcode, code.data, (data: any)=> {
          p2(data, tempData);
        },
        (data: any)=>{
          callback(data, tempData);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  selectCustom(p1, p2, callback, callback2) {
    if(typeof p1 == 'string') {
        this.sendPostCustom(this.type.select, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPostCustom(this.type.select, code.mapcode, code.data, (data: any)=> {
          p2(data);
        },
        (data: any)=> {
          callback(data);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  insert(p1, p2, callback?, callback2?) {
    if(typeof p1 == 'string') {
        this.sendPost(this.type.insert, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPost(this.type.insert, code.mapcode, code.data, (data: any)=> {
          p2(data);
        },
        (data: any)=> {
          callback(data);
        });
      } else{
        callback2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  update(p1, p2, callback?, callback2?) {
    if(typeof p1 == 'string') {
        this.sendPost(this.type.update, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPost(this.type.update, code.mapcode, code.data, (data: any)=> {
          p2(data);
        },
        (data: any)=> {
          callback(data);
        });
      } else{
        callback(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  delete(p1, p2, callback, callback2) {
    if(typeof p1 == 'string') {
        this.sendPost(this.type.delete, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPost(this.type.delete, code.mapcode, code.data, (data: any)=> {
          p2(data);
        },
        (data: any)=> {
          callback2(data);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  action(p1, p2, callback, callback2) {
    if(typeof p1 == 'string') {
        this.sendPost(this.type.action, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPost(this.type.action, code.mapcode, code.data, (data: any)=> {
          p2(data);
        },
        (data: any)=> {
          callback2(data);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  attach(p1, p2, callback, callback2) {
    if(typeof p1 == 'string') {
        this.sendPost(this.type.attach, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPost(this.type.attach, code.mapcode, code.data, (data: any)=> {
          p2(data);
        },
        (data: any)=> {
          callback2(data);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  excel(p1, p2, callback, callback2) {
    if(typeof p1 == 'string') {
        this.sendPost(this.type.excel, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPost(this.type.excel, code.mapcode, code.data, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  excelFile(p1, p2, p3, callback, callback2) {
    let url = null;
    let data = {};
    let fileNm;
    let cal1;
    let cal2;
    if (typeof p1 == 'string') {
      url = this.staticVariable.getUrl('/'+ this.type.excel +'/' + p1  + '.json');

      if (typeof p2 == 'string') {
        if(p2.indexOf('xls') != -1 || p2.indexOf('xlsx') != -1) {
          fileNm = p2;
        } else {
          fileNm = p2 + '.xlsx';
        }
        data = p3;
        cal1 = callback;
        cal2 = callback2;
      } else {
        fileNm = '';
        data = p2;
        cal1 = p3;
        cal2 = callback;
      }
    } else {
      var code = this.getMapCode(p1);
      if (code.result) {
        url = this.staticVariable.getUrl('/'+ this.type.excel +'/' + code.mapcode  + '.json');
        data = p1;
      } else {
        p2(this.makeErrorMsg('undefinedSqlMap'));
        return;
      }

      if (p1.fileNm != undefined) {
        if (p1.fileNm.indexOf('xls') != -1 || p1.fileNm.indexOf('xlsx') != -1) {
          fileNm = p1.fileNm;
        }else if (p1.fileNm.indexOf('.pdf') != -1) {
          fileNm = p1.fileNm;
        }else {
          fileNm = p1.fileNm + '.xlsx';
        }
      } else {
        fileNm = '';
      }

      // 파일을 바로 반환하지 않는 경우에 대한 처리
      if(p1.returnYN != undefined && p1.returnYN == 'N'){
        fileNm = '';
      }

      cal1 = p2;
      cal2 = p3;
    }
    var temp: any = {};
    temp = this.makeData(temp);
    url += '?userkey=' + temp.userkey;

    this.http.post(url, data).subscribe(res => {
      if(fileNm != null && fileNm != ''){
        var linkElement = document.createElement('a');
        try {
          let result: string = res.toString();
          var blob = new Blob([result], { type: 'application/octet-stream' });

          if (navigator.msSaveOrOpenBlob) { // IE 10+
              navigator.msSaveOrOpenBlob(blob, fileNm);
          } else { // not IE
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const url = URL.createObjectURL(blob);

            if (fileNm == '') {
              var urls = url.split('/');
              fileNm = urls[urls.length-1] + '.xlsx';
            }
            linkElement.setAttribute('href', url);
            linkElement.setAttribute('download', fileNm);
            // // var clickEvent = new MouseEvent("click", {
            // //     "view": window,
            // //     "bubbles": true,
            // //     "cancelable": false
            // // });
            // linkElement.dispatchEvent(clickEvent);
            if(cal1 != undefined) {
              cal1(result);
            }
          }
        } catch (ex) {
          if(cal2 != undefined) {
            cal2(ex);
          }
        }
      }
    },
    error => {
      if(cal2 != undefined) {
        cal2(data);
      }
    });
  }

  // 위너스제이엠 보고서 관련
  wjmReport(data, cal1, cal2, p2?) {
    var url = null;
    var fileNm;

    var code = this.getMapCode(data);
    if (code.result) {
      url = this.staticVariable.getUrl('/wjm/analysis.json');
    } else {
      p2(this.makeErrorMsg('undefinedSqlMap'));
      return;
    }

    if (data.fileNm != undefined) {
      fileNm = data.fileNm;
    } else {
      fileNm = '';
    }

    // 파일을 바로 반환하지 않는 경우에 대한 처리 > 개인보고서
    if(data.returnYN != undefined && data.returnYN == 'N'){
      fileNm = '';
    }

    var temp: any = {};
    temp = this.makeData(temp);
    url += '?userkey=' + temp.userkey;

    this.http.post(url, data).subscribe(res => {
      // 파일 다운로드
      if(fileNm != ''){
        var linkElement = document.createElement('a');
        try {
          let result: string = res.toString();
          var blob = new Blob([result], { type: 'application/octet-stream' });

          if (navigator.msSaveOrOpenBlob) { // IE 10+
              navigator.msSaveOrOpenBlob(blob, fileNm);

          } else { // not IE
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const url = URL.createObjectURL(blob);
            linkElement.setAttribute('href', url);
            linkElement.setAttribute('download', fileNm);
            // var clickEvent = new MouseEvent("click", {
            //     "view": window,
            //     "bubbles": true,
            //     "cancelable": false
            // });
            //linkElement.dispatchEvent(clickEvent);
            if(cal1 != undefined) {
                cal1(result);
            }
          }
        } catch (ex) {
          if(cal2 != undefined) {
            cal2(ex);
          }
        }
      }
    },
    error => {
      if(cal2 != undefined) {
        cal2(error);
      }
    });

  }

  api(p1, p2, callback?, callback2?) {
    if(typeof p1 == 'string') {
        this.sendPostApi(this.type.api, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPostApi(this.type.api, code.mapcode, code.data, (data: any)=> {
          p2(data);
        },
        (data: any)=> {
          callback(data);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  openApi(p1, p2, callback?, callback2?) {
    if(typeof p1 == 'string') {
      this.sendPostOpen(this.type.openApi, p1, p2, (data: any)=> {
        callback(data);
      },
      (data: any)=> {
        callback2(data);
      });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPostOpen(this.type.openApi, code.mapcode, code.data, (data: any)=> {
          p2(data);
        },
        (data: any)=> {
          callback(data);
        });
      } else{
        p2(this.makeErrorMsg('undefinedSqlMap'));
      }
    }
  }

  sendAjax(type, sqlmap, data, callback) {
    if(data == undefined){
      data = {};
    }
    var url = '/'  + type + '/' + sqlmap + '/action.json';
    if(sqlmap.indexOf('.json') > -1){
      url = '/'  + type + '/' + sqlmap;
    }
    data.userkey = rootScope.gVariable.userkey;
    // if (sessionStorage['loginSysAdminYN'] == "Y" && !data.srchTenantId) {
    //   data.srchTenantId = sessionStorage['srchTenantId'];
    // }
    url = this.staticVariable.getUrl(url);
    url = url + '?' +rootScope.gVariable.userkey;
    var reciveJsonData = null;

    this.http.post(url, data).subscribe(res => {
      callback(reciveJsonData);
    },
    error => {

    });
  }

  customApi(request: any, success, fail){
    const url = this.staticVariable.getUrl(request.url);
    const prep = this.getMapCode(request);
    if(prep.result){
      const body = this.makeData(prep.data);
      this.http.post(url, body, this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
        success(this.makeResultData(data));
      },
      error=> {
        fail(error);
      });
    }
  }

}
