import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customdate'
})
export class CustomdatePipe implements PipeTransform {

  transform(origin: Date, ...args: unknown[]): unknown {
    const date = typeof origin === 'number' ? new Date(origin) : origin;
    let result: string;
    const day = ['일', '월', '화', '수', '목', '금', '토'];
    if(date) {
      switch (args[0]) {
        case 'kor':
          var days = ['일', '월', '화', '수', '목', '금', '토'];
          result = date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + '일(' + days[date.getDay()] + ')';
        break;
        case 'yyyy.mm.dd': 
        result = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
        break;
        case 'mm.dd':
          result = (date.getMonth() + 1) + '.' + date.getDate();
        break;
        case 'mm.dd(day)':
          result = (date.getMonth() + 1) + '.' + date.getDate() + '(' + day[date.getDay()] + ')';
      }
    }
    return result;
  }

}
