import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appComma]'
})
export class CommaDirective {

  constructor(
    private el : ElementRef
  ) { }

  @HostListener('keyup')
  valid(){
    let val: string = this.el.nativeElement.value;
    if(val.length > 1 && val.startsWith('0')){
      val = val.slice(1);
    }
    val = val.replaceAll(',', '');
    const len = val.length;
    for(let i = 1; len > 3 * i; i++){
      val = val.substr(0, len - 3 * i) + ',' + val.substr(len - 3 * i);
    }

    this.el.nativeElement.value = val;
  }
}
