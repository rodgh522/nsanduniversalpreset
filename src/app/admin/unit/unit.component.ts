import { Component, OnInit } from '@angular/core';
import { DialogService } from '@src/app/service/dialog.service';
import { AddComponent } from './add/add.component';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  title = '숙소관리';
  constructor(
    private dialog: DialogService,
    
  ) { }

  ngOnInit(): void {
  }

  openAdd(){
    this.dialog.slide(AddComponent, {data: ''});
  }
}
