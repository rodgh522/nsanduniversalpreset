import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[fileDropZone]'
})
export class FileDropZoneDirective {

  @Output() files = new EventEmitter();
  constructor(
    private eleRef: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('dragover', ['$event'])
  dragOver(e){
    e.preventDefault();
    e.stopPropagation();
    this.renderer.setStyle(this.eleRef.nativeElement, 'color', '#1b3a57');
    this.renderer.setStyle(this.eleRef.nativeElement, 'fontWeight', 'bold');
  }

  @HostListener('dragleave', ['$event'])
  dragLeave(e){
    e.preventDefault();
    e.stopPropagation();
    this.renderer.setStyle(this.eleRef.nativeElement, 'color', '#000');
    this.renderer.setStyle(this.eleRef.nativeElement, 'fontWeight', '100');
  }

  @HostListener('drop', ['$event'])
  public dropped(e){
    e.preventDefault();
    e.stopPropagation();
    this.renderer.setStyle(this.eleRef.nativeElement, 'color', '#000');
    this.renderer.setStyle(this.eleRef.nativeElement, 'fontWeight', '100');
    this.files.emit(e.dataTransfer.files);
  }
}
