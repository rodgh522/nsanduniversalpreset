import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DialogService } from '@src/app/service/dialog.service';
import { FileTransferService } from '@src/app/service/file-transfer.service';

@Component({
  selector: 'app-img-single',
  templateUrl: './img-single.component.html',
  styleUrls: ['./img-single.component.scss']
})
export class ImgSingleComponent implements OnInit {

  @ViewChild('major') major: ElementRef;
  @Output() fileChange = new EventEmitter();
  @Input() 
  get files (){
    return this.data;
  }

  set files(value){
    this.data = value;
    this.fileChange.emit(this.data);
  }

  total = 0;
  data: any = {};
  constructor(
    private dialog: DialogService,
    private fileTrans: FileTransferService
  ) { }

  ngOnInit(): void {
  }

  openFileReader(){
    this.major.nativeElement.click();
  }

  upload(files){
    const newFiles: Array<any> = this.typeCheck(files);
    if(newFiles === null){
      return;
    }

    this.total = newFiles.length + this.data.length;
    if (this.total > 10) {
      return;
    }else {
      this.fileTrans.uploadFiles(newFiles).then(res => {
        res.forEach(item => {
          item.fileType = this.execFileType(item.fileName);
          this.data = item;
        });
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
          this.dialog.alert({
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
