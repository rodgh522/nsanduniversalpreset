import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DialogService } from '@src/app/service/dialog.service';
import { FileTransferService } from '@src/app/service/file-transfer.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-img-multi',
  templateUrl: './img-multi.component.html',
  styleUrls: ['./img-multi.component.scss']
})
export class ImgMultiComponent implements OnInit {

  @ViewChild('sub') sub: ElementRef;
  @Output() uploaded = new EventEmitter();
  total = 0;
  files = [];
  constructor(
    private dialog: DialogService,
    private fileTrans: FileTransferService
  ) { }

  ngOnInit(): void {
  }

  openFileReader(){
    this.sub.nativeElement.click();
  }

  upload(files){
    const newFiles: Array<any> = this.typeCheck(files);
    if(newFiles === null){
      return;
    }

    // 사진은 최대 10장까지만
    this.total = newFiles.length + this.files.length;
    if (this.total > 10) {
      return;
    }else {
      this.fileTrans.uploadFiles(newFiles).then(res => {
        res.forEach(item => {
          item.fileType = this.execFileType(item.fileName);
          this.files.push(item);
        });
        
        this.uploaded.emit(this.files);
      });
    }
  }

  execFileType(name: string){
    const type = name.split('.').pop().toLocaleLowerCase();
    let result = '';
    switch(type){
      case 'jpg' : case 'png' : case 'gif' : result = 'image';
        break;
      default : result = 'none';
    }
    return result;
  }

  typeCheck(files){
    const newFiles = [];
    for(const key in files){
      if(files[key] instanceof File){
        const type = this.execFileType(files[key].name);
        if(type === 'none'){
          this.dialog.alert(AlertComponent, {
            msg: 'jpg, gif, png 파일만 가능합니다.',
          });
          return null;
        }else{
          newFiles.push(files[key]);
        }
      }
    }
    return newFiles;
  }
}
