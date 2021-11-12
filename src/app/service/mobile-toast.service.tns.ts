import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileToastService {

  msg: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() { }

  setMsg(msg:string) {
    this.msg.next(msg);
  }
}
