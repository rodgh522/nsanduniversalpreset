import { CdkDrag, CdkDragEnter, CdkDragMove, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DialogService } from '@src/app/service/dialog.service';
import { FileTransferService } from '@src/app/service/file-transfer.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-img-multi',
  templateUrl: './img-multi.component.html',
  styleUrls: ['./img-multi.component.scss']
})
export class ImgMultiComponent implements OnInit, AfterViewInit {

  @ViewChild('sub') sub: ElementRef;
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
  data = [];

  movies = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ];

  @ViewChild(CdkDropList) placeholder: CdkDropList;
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  
  constructor(
    private dialog: DialogService,
    private fileTrans: FileTransferService,
    private viewportRuler: ViewportRuler
  ) { 
    this.target = null;
    this.source = null;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'inline-block';
    phElement.parentElement.removeChild(phElement);
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
    this.total = newFiles.length + this.data.length;
    if (this.total > 10) {
      return;
    }else {
      this.fileTrans.uploadFiles(newFiles).then(res => {
        res.forEach(item => {
          item.fileType = this.execFileType(item.fileName);
          this.data.push(item);
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

  drop(e, data){
    this.source = null;
    this.target = null;
  }
}
