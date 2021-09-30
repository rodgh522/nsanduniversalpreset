import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  msg: string;
  ok: any = {};
  cancel: any = {};
  
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.msg = this.data.msg;
    console.log(this.data);
    this.ok = this.data.ok;
    this.cancel = this.data.cancel;

  }

  ngOnInit(): void {
  }

}
