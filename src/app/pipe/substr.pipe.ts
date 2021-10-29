import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substr'
})
export class SubstrPipe implements PipeTransform {

  transform(value: any, args: number): unknown {
    return value.substr(0, args);;
  }

}
