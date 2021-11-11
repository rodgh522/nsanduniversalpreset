import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ImageSource, isIOS, knownFolders, path } from '@nativescript/core';
import { ImagePicker, create } from '@nativescript/imagepicker';
import { StaticVariableService } from '../global/static-variable.tns';
import { session } from '@nativescript/background-http';

@Directive({
  selector: '[appMobileFileAttach]'
})
export class MobileFileAttachDirective {

  @Input() pickFrom: string;
  @Input() multipart;
  @Output() onUploaded = new EventEmitter;

  context: ImagePicker;
  session = session('image-upload');

  constructor(
    private staticVariable: StaticVariableService
  ) {
  }

  @HostListener('tap')
  onTap(){
    this.pickImage();
  }

  
  pickImage(){
    this.context = create({
      mode: 'multiple',
      maximumNumberOfSelection: 10
    });

    this.context.authorize().then(()=> {
      return this.context.present();
    }).then(selection=> {
      this.getPath(selection).then(bundle=> {
        this.uploadImage(bundle);
      });
    }).catch(error=> {
      console.log(error);
    });
  }

  uploadImage(bundle){
    var params = [];

    bundle.forEach((file, i) => {
      params.push({
        name: 'file' + i,
        filename: file,
        mimeType: 'image/jpeg'
      });
    });
    const request = this.createNewRequest();
    const task = this.session.multipartUpload(params, request);

    task.on("error", this.onEvent.bind(this));
    task.on("responded", this.onEvent.bind(this));
  }

  async getPath(files){
    let bundle = [];
    return new Promise(resolve=> {
      if(isIOS){
        files.forEach((img, i)=> {
          const fileNm = new Date().getTime() + '.jpg';
          const folder = knownFolders.documents().path;
          const filepath = path.join(folder, fileNm);
          img.options = { width: 300, height: 400, keepAspectRatio: true};
          ImageSource.fromAsset(img).then(source=> {
            source.saveToFile(filepath, 'jpg', 20);
            bundle.push(filepath);
          }).then(()=> {
            if(files.length === i + 1){
              resolve(bundle);
            }
          });
        });
      }else{
        files.forEach(img=> {
          bundle.push(img.android);
        });
        resolve(bundle);
      }
    });
  }

  private createNewRequest() {
    const request = {
        url: this.staticVariable.getUrl2('/home/attach/temp/upload.do') + '?tempKey=' + '000',
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream"
        },
        description: "uploading file...",
        androidAutoDeleteAfterUpload: false,
        androidAutoClearNotification: true
    };

    return request;
  }

  onEvent(e) {
    const response = JSON.parse(e.data);
    if(e.eventName === 'responded'){
      const links = [];
      response.responseVO.body.docs.map(each=> {
        let url: string;
        url = this.staticVariable.getUrl2('/home/attach/temp/' + each.tmpFileKey + '/download.do?fileName=' + each.encFileName + '&tempKey=000');
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
      this.onUploaded.emit(links);
    }else{
      console.log('error');
    }
  }

}
