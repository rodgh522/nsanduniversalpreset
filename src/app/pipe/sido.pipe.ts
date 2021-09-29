import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sido'
})
export class SidoPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const sido = value.split(' ').splice(0, 2);
    return sido[0] + ' ' + sido[1];
  }

}
