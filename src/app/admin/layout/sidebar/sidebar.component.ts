import { state, style, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('highlight', [
      state('active', style({color: '#000', borderRadius: '5px', backgroundColor: '#ddd'})),
      state('deactive', style({color: '#a7a7aa', backgroundColor: '#eee'}))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  @Output() onFolded = new EventEmitter;
  selected: string;
  folded = false;

  constructor() { }

  ngOnInit(): void {
  }

  foldSide(){
    this.folded = !this.folded;
    this.onFolded.emit(this.folded);
  }
}
