import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANT } from '@src/assets/global-constant';
import { isNullOrEmpty, rootScope } from '../global/global';
import { StaticVariableService } from '../global/static-variable';

@Injectable({
  providedIn: 'root'
})
export class FileTransferService {

  constructor(
    private staticVariable: StaticVariableService,
    private http: HttpClient
  ) { }

  makeData(data: any) {
    data.userkey = rootScope.gVariable.userkey;
    return data;
  }

  sendPost(url: string, reqData: any, callback, callback2?) {
    this.http.post(
      url,
      reqData,
      this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
        callback(this.makeResultData(data), reqData.mapcode);
      },
      (error)=> callback2(error, reqData.mapcode)
    );
  }

  makeResultData(data){
    const result: any = {};
    if(data == null || data.responseVO == null){
      return result;
    }
    result.header = data.responseVO.header;
    result.body = data.responseVO.body;
    return result;
  }

  uploadFiles(files: Array<any>): Promise<any>{
    return new Promise((resolve, rejects) => {

      const formData = new FormData();
      files.forEach(a=> {
        formData.append(a.name, a);
      });

      this.uploadFile(formData, res=>{
        if(res.header.status === CONSTANT.HttpStatus.OK){
          const links = [];
          res.body.docs.forEach(each =>{
            let url: string;
            // 비회원 파일 업로드(회원가입)
            if(isNullOrEmpty(rootScope.gVariable.userkey)){
              url = this.staticVariable.getUrl1('/openapi/attach/temp/' + each.tmpFileKey + '/download.do?fileName=' + each.encFileName);
            }else{
              url = this.staticVariable.getUrl1('/attach/temp/' + each.tmpFileKey + '/download.do?fileName=' + each.encFileName);
            }
            const obj: any = {};
            obj.fileName = each.fileName;
            obj.size = each.size;
            obj.isLoaded = true;
            obj.tmpFileKey = each.tmpFileKey;
            obj.typeId = each.typeId;
            obj.path = each.path;
            // obj.RelateId = vm.relateId;
            obj.link = url;
            obj.delState = '';
            links.push(obj);
          });

          resolve(links);
        }
      },
      error => {
        rejects(error);
        console.error(error);
      });
    });
  }

  uploadFile(data: FormData, callback1, callback2?){
    let url: string;
    // 사용자 업로드
    if(isNullOrEmpty(rootScope.gVariable.userkey)){
      url = this.staticVariable.getUrl2('/home/attach/temp/upload.do') + '?tempKey=' + rootScope.gVariable.MemId;
    }else{
      url = this.staticVariable.getUrl1('/attach/temp/upload.do');
    }
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = () => {
      const result = JSON.parse(xmlHttp.response).responseVO;
      callback1(result);
    };

    xmlHttp.open('POST', url);
    xmlHttp.send(data);
  }

  onFileDelete(data, callback1, callback2?){
    let url;
    if(data.id){
      url = this.staticVariable.getUrl1('/attach/file/delete.do');
      data.fileId = data.id;
      this.sendPost(url, this.makeData(data), (result)=> callback1(result), (result)=> callback2(result));
    }else{
      // 사용자 업로드
      if(isNullOrEmpty(rootScope.gVariable.userkey)){
        url = this.staticVariable.getUrl2('/home/attach/temp/delete.do');
        data.tempKey = rootScope.gVariable.MemId;
        this.http.post(url, data, this.staticVariable.getRequestActions.defaultAction()).subscribe(data => {
          callback1(data);
        },
        (error)=> {
          console.error('[Error]=> ' + error);
        });
      }else{
        url = this.staticVariable.getUrl1('/attach/temp/' + data.tmpFileKey + '/delete.do');
        data.attachId = data.tmpFileKey;
        this.http.get(url, data).subscribe(result=> callback1(result));
      }
    }
  }
}
