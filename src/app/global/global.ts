import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

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
  export let windowSize: any = {};
  export let savedUrl: string;
  export let currentLanguage = '';
  export let navbarToggle: boolean;
  export let paymentData: any = {};

  export let gVariable: any = {};

  export let isWeb: boolean;

  export function setUserSession(data: any){
    for(const key in data){
      if(data[key]){
        sessionStorage[key] = data[key];
      }
    }

    setSessionToRootScope();
  }

  export function setSessionToRootScope() {
    for(const key in sessionStorage){
      if(typeof sessionStorage[key] !== 'function'){
        rootScope.gVariable[key] = sessionStorage[key];
      }
    }
  }

  export function setLocalStorageToLayout(type: string){
    localStorage.setItem('layoutBoardState', type);
  }

  export function sessionExpire() {
    sessionStorage.clear();
  }

  export function sessionStroageToData(){
    let data: any = {};
    for(const key in sessionStorage){
      data[key] = sessionStorage[key];
    }
    setSessionToRootScope();  
    return data;
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
        rootScope.gVariable[key] = data[key];
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

export function objToForm(data: any, controls){
  for(const key in data){
    if(controls[key]){
      controls[key].setValue(data[key]);
    }
  }
  return controls;
}

export function objFilter(data: any, target: string){
  let result = [];
  for (const key in data) {
    result.push(data)
  }
}

export function defaultCheckinTime(){
  let result = [];
  for(let i = 10; i < 19; i++){
    result.push(i + ' : 00');
  }
  return result;
}

export function isNullOrEmpty(value? : any): boolean{
  return value === '' || value === ' '  || value === '0.00' || value === null || value === undefined ||
  (value != null && typeof value === 'object' && !Object.keys(value).length);
}

export function changeFormat(list){
  const result = list.map((a)=> {
    var date = new Date(a);
    return {
      bookingDt: date.toStrFormat(),
      bookingDay: date.getDay()
    };
  });
  return result;
}