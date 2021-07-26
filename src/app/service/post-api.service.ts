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
    this.http.post(this.staticVariable.getUrl1('/'+ p1 +'/' + p2  + '/action.json'), p3,
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      callback(this.makeResultData(data), p2);
    },
    (error)=>{
      callback2(error, p2);
    });
  }

  sendPostApi(p1, p2, p3, callback, callback2) {
    this.http.post(this.staticVariable.getUrl1('/'+ p1 +'/' + p2  + '.json'), p3,
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      callback(this.makeResultData(data));
    },
    (error)=> {
      callback2(error);
    });
  }

  sendOpenPostApi(p1, p2, callback, callback2) {
    this.http.post(this.staticVariable.getUrl1(p1), p2,
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      callback(this.makeResultData(data));
    },
    (error)=> {
      callback2(error);
    });
  }

  login(p1, p2, callback?, callback2?) {
    if(typeof p1 == 'string') {
        this.sendPostApi(this.type.login, p1, p2, (data: any)=> {
          callback(data);
        },
        (data: any)=> {
          callback2(data);
        });
    } else {
      const code = this.getMapCode(p1);
      if(code.result) {
        this.sendPostApi(this.type.login, code.mapcode, code.data, (data: any)=>{
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
      url = this.staticVariable.getUrl1('/'+ this.type.excel +'/' + p1  + '.json');

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
        url = this.staticVariable.getUrl1('/'+ this.type.excel +'/' + code.mapcode  + '.json');
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
      this.sendPostApi(this.type.openApi, p1, p2, (data: any)=> {
        callback(data);
      },
      (data: any)=> {
        callback2(data);
      });
    } else {
      var code = this.getMapCode(p1);
      if(code.result) {
        this.sendPostApi(this.type.openApi, code.mapcode, code.data, (data: any)=> {
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

  home(data: any, seccess, fail){
    this.http.post(this.staticVariable.getUrl2('/home/' + data.mapcode + '.json'), data, 
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      seccess(this.makeResultData(data));
    },
    (error)=> {
      fail(error);
    });
  }

  movilaSelect(data: any, seccess, fail){
    this.http.post(this.staticVariable.getUrl2('/home/select/' + data.mapcode + '.json'), data, 
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      seccess(this.makeResultData(data));
    },
    (error)=> {
      fail(error);
    });
  }

  movilaInsert(data: any, seccess, fail){
    this.http.post(this.staticVariable.getUrl2('/home/insert/' + data.mapcode + '.json'), data, 
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      seccess(this.makeResultData(data));
    },
    (error)=> {
      fail(error);
    });
  }

  movilaUpdate(data: any, seccess, fail){
    this.http.post(this.staticVariable.getUrl2('/home/update/' + data.mapcode + '.json'), data, 
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      seccess(this.makeResultData(data));
    },
    (error)=> {
      fail(error);
    });
  }
  movilaDelete(data: any, seccess, fail){
    this.http.post(this.staticVariable.getUrl2('/home/delete/' + data.mapcode + '.json'), data, 
    this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
      seccess(this.makeResultData(data));
    },
    (error)=> {
      fail(error);
    });
  }

}
