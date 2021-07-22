import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

declare global {
    interface String {
        fillStr: (str: string | number, len: number) => string;
        left(len: string | number): string;
        replaceAll(target: string  | number, replacement: string): string;
    }
    interface Date{
        toStrFormat(): string;
    }
}

String.prototype.fillStr = function(str, len) {
    var orgStr = this.toString();
    while (orgStr.toString().length < len) {
      orgStr = str + orgStr;
    }
    return orgStr;
}

String.prototype.left = function(len) {
    var orgStr = this.toString();
    return orgStr.substring(0, len);
}
  
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
}
  
Date.prototype.toStrFormat = function(){
    const result = [
      this.getFullYear(),
      (this.getMonth()+1).toString().padStart(2, '0'),
      this.getDate().toString().padStart(2, '0')
      ].join('-');
    return result;
}

export namespace rootScope{
    export let currentLanguage = '';
    export let navbarToggle: boolean;
  
    export let gVariable: any = {};
  
    export let isWeb: boolean;
  
    export function setUserSession(data: any){
      for(const key in data){
        if(data[key]){
          sessionStorage[key] = data[key];
        }
      }
      sessionStorage['isLoggedIn'] = 'Y';
      sessionStorage['loginTenantId'] = data.TenantId == null ? 0 : data.TenantId;
      sessionStorage['loginTenantDir'] = data.TenantDir == null ? null : data.TenantDir;
      sessionStorage['noHeader'] = data.noHeader == null ? false : data.noHeader;
      sessionStorage['mainPage'] = data.mainpage == null ? 'app.dashboard' : data.mainpage;
      sessionStorage['mainPageSrch'] = data.mainpagesrch == null ? '' : data.mainpagesrch;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setSessionToRootScope();
  
    }
  
    export function setSessionToRootScope() {
      for(const key in sessionStorage){
        if(typeof sessionStorage[key] !== 'function'){
          rootScope.gVariable[key] = sessionStorage[key];
        }
      }
      rootScope.gVariable.userkey = sessionStorage['userkey'] + '-' + sessionStorage['loginTenantId'];
    }
  
    export function setLocalStorageToLayout(type: string){
      localStorage.setItem('layoutBoardState', type);
    }
  
    export function getLocalStorageToLayout(){
      let type: string = localStorage['layoutBoardState'];
      return (type == null || type === undefined || type === '') ? 'N' : type;
    }
  
    export function changeLanguage(langKey){
      // $translate.use(langKey);
      rootScope.currentLanguage = langKey;
      //sessionStorage.setItem("currentLanguage", langKey);
    }
  
    export function setGVariable(data: any, val?: string){
      if(val){
        rootScope.gVariable[data] = val;
      }else{
        for(const key in data){
          if(data[key] !== ''){
            rootScope.gVariable[key] = data[key];
          }
        }
      }
    }
  
  
    // 엑셀 설정
    // 다중 시트 기능 추가 2020-01-20 hansol
    export function excelDown(exportData, fileName, sheetNames?) {
  
  
    }
  
    //yyyy-mm-dd > new Date 형태로 변환
    export function getDateFormat(dateStr) {
      let dateArr;
  
      if (typeof(dateStr) == 'undefined') {
        return null;
      }else {
        dateArr = dateStr.split('-');
      }
  
      if (dateArr.length === 3) {
        // eslint-disable-next-line radix
        return new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2]);
      }else {
        return null;
      }
    }
}
    
export function checkPwd(ctrl1, ctrl2){
    return (group: FormGroup)=> {
        const control = group.controls[ctrl1];
        const control2 = group.controls[ctrl2];

        if(control2.errors && !control2.errors.mustMatch){
            return;
        }

        if(control.value !== control2.value){
            control2.setErrors({ mustMatch: true });
        }else{
            control2.setErrors(null);
        }
    }
}

export function validCheck(controls){
    for(const key in controls){
        if(controls[key] && !controls[key].valid){
            return true;
        }
    }
    return false;
}

export function formToObj(controls){
    let result: any = {};
    for(const key in controls){
        if(controls[key]){
            result[key] = controls[key].value;
        }
    }
    return result;
}