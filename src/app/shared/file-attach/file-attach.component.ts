import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DialogService } from '@src/app/service/dialog.service';
import { FileTransferService } from '@src/app/service/file-transfer.service';

@Component({
  selector: 'app-file-attach',
  templateUrl: './file-attach.component.html',
  styleUrls: ['./file-attach.component.scss']
})
export class FileAttachComponent implements OnChanges{

  @ViewChild('fileReader') fileReader: ElementRef;
  @Output() uploaded = new EventEmitter();
  @Input() refresh: number;
  @Input() loadedFile: any;
  total = 0;
  files = [];
  constructor(
    private fileTrans: FileTransferService,
    private dialog: DialogService
  ) { }

  ngOnChanges(changes): void {
    console.log(changes);
    if(this.refresh > 0){
      this.files = [];
      this.uploaded.emit(this.files);
    }
    if(this.loadedFile.length > 0){
      this.files = this.loadedFile;
    }
  }

  openFileReader(){
    this.fileReader.nativeElement.click();
  }

  // web에서 사진 추가시
  upload(files){
    const newFiles = [];
    for(const key in files){
      if(files[key] instanceof File){
        const type = this.execFileType(files[key].name);
        if(type === 'none'){
          this.dialog.alert({
            msg: 'mp3, mp4, doc, docx, xls, xlsx, ppt, pptx, hwp, pdf, txt, jpg, gif, png, zip, alz, rar, 7z 파일만 가능합니다.',
          });
          return;
        }else{
          newFiles.push(files[key]);
        }
      }
    }

    // 사진은 최대 10장까지만
    this.total = newFiles.length + this.files.length;
    if( this.total > 10){
      return;
    }else{
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
      case 'mp3' : case 'mp4' : result = 'video';
        break;
      case 'doc' : case 'docx' : result = 'docx';
        break;
      case 'xls' : case 'xlsx' : result = 'xlsx';
        break;
      case 'ppt' : case 'pptx' : result = 'pptx';
        break;
      case 'jpg' : case 'png' : case 'gif' : result = 'image';
        break;
      case 'zip' : case 'alz' : case 'rar' : case '7z' : result = 'zip';
        break;
      case 'hwp' : result = 'hwp';
        break;
      case 'pdf' : result = 'pdf';
        break;
      case 'txt' : result = 'txt';
        break;
      default : result = 'none';
    }
    return result;
  }

  deleteFile(idx: number){
    let item: any = {};
    item = this.files[idx];

    this.fileTrans.onFileDelete(item, res =>{
      this.files.splice(idx, 1);
      this.uploaded.emit(this.files);
    },
    error =>{
      console.error(error);
    });
  }
}
