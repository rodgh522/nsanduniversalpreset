import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { rootScope } from '../global/global';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchList = new BehaviorSubject({});
  searchDetail = new BehaviorSubject({});
  srch: any = {};

  constructor() { 
    this.getSessionStorage();
  }

  setSearchList(data){
    this.setSessionStorage(data);
    this.searchList.next(data);
  }

  setSearchDetail(data){
    this.setSessionStorage(data);
    this.searchDetail.next(data);
  }

  setSessionStorage(data: any){
    if(rootScope.isWeb) {
      for(const key in data){
        sessionStorage.setItem(key, data[key]);
      }
    }
  }

  getSessionStorage(){
    if(rootScope.isWeb) {
      let data: any = {
        Sido: this.strToArray('Sido'),
        dates: this.strToArray('dates'),
        GuestMax: parseInt(sessionStorage.getItem('GuestMax')),
        straight: sessionStorage.getItem('straight')
      };
      this.searchList.next(data);
      data.AcomId = sessionStorage.getItem('AcomId') ? sessionStorage.getItem('AcomId') : '';
      this.searchDetail.next(data);
    }
  }

  strToArray(key){
    if(!sessionStorage.getItem(key)) {
      return;
    }
    let result: Array<any> = sessionStorage.getItem(key) != '' ? sessionStorage.getItem(key).split(',') : [];
    if(key === 'dates') {
      result = result.map(a=> new Date(a));
    }
    return result;
  }
}
