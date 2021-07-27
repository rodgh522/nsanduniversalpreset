import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  snackConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center'
  };

  constructor(
    private _snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) { }

  alert(component: ComponentType<any>, data: any) {
    const dialogRef = this.matDialog.open(component, {data: data});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  confirm(component: ComponentType<any>, data: any){
    const dialogRef = this.matDialog.open(component, {data: data});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  modal(component: ComponentType<any>, data: any, config: MatDialogConfig): Observable<any>{
    config.data = data;
    const dialogRef = this.matDialog.open(component, config);

    return dialogRef.afterClosed();
  }

  toast(msg){
    this._snackBar.open(msg, '', this.snackConfig);
  }

  slide(component: ComponentType<any>, data: any): Observable<any>{
    const config: MatDialogConfig = {
      height: '100%',
      panelClass: 'full-screen-modal',
      data: data,
      position: { right: '0'},
      closeOnNavigation: true
    };
    
    const dialogRef = this.matDialog.open(component, config);

    return dialogRef.afterClosed();
  }
}
