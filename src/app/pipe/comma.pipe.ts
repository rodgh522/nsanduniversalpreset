import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comma'
})
export class CommaPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let num = '';
    let straightCnt = 0;
    let reverse = '';
    let result = '';
    
    if(typeof value === 'number') {
      num = value.toString();
    }
    for(let i = num.length - 1; i >= 0; i--) {
      if(straightCnt < 3) {
        straightCnt++;
      }else {
        reverse += ',';
        straightCnt = 1;
      }
      reverse += num.charAt(i);
    }
    for(let i = reverse.length - 1; i >= 0; i--){
      result += reverse.charAt(i);
    }
    return result;
  }

}
