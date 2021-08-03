import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimal]'
})
export class DecimalDirective {

  constructor(private el : ElementRef) { }

  @HostListener('keyup')
  valid(){
    this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9\.\,]/, '');
  }
}
