import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customdate'
})
export class CustomdatePipe implements PipeTransform {

  transform(origin: Date, ...args: unknown[]): unknown {
    var result;

    if(origin) {

      switch (args[0]) {
        case 'kor':
          var days = ['일', '월', '화', '수', '목', '금', '토'];
          result = origin.getFullYear() + '년 ' + (origin.getMonth() + 1) + '월 ' + origin.getDate() + '일(' + days[origin.getDay()] + ')';
        break;
      }
    }
    return result;
  }

}
