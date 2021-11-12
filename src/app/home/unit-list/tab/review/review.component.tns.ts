import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { rootScope } from '@src/app/global/global';
import { SessionService } from '@src/app/service/session.service.tns';
import { ImgViewerComponent } from '@src/app/shared/modal/img-viewer/img-viewer.component.tns';
import { confirm } from '@nativescript/core';
import { PostApiService } from '@src/app/service/post-api.service.tns';
import { StaticVariableService } from '@src/app/global/static-variable.tns';
import { Router } from '@angular/router';
import { MobileToastService } from '@src/app/service/mobile-toast.service.tns';

@Component({
  selector: 'ns-review',
  templateUrl: './review.component.tns.html',
  styleUrls: ['./review.component.tns.scss']
})
export class ReviewComponent implements OnInit {

  @Input('id') id: string;
  typing: any = {
    score: 5,
    text: ''
  }
  uploadFileList = [];
  list = [];
  user;
  onEdit = true;

  constructor(
    private modalService: ModalDialogService,
    private session: SessionService,
    private postApi: PostApiService,
    private staticVariable: StaticVariableService,
    private toast: MobileToastService,
    private router: Router,
    private _ngZone: NgZone
  ) { 
    this.user = this.session.user$.value;
  }

  ngOnInit(): void {
    this.getReview();
  }

  getFiles(e){
    const availableCnt = 5 - this.uploadFileList.length;
    const repeatCnt = availableCnt > e.length ? e.length : availableCnt;
    // callback 처리된 내용이 UI에 반영이 안될때 ngZone 처리
    this._ngZone.run(()=> {
      if(availableCnt > 0) {
        for(let i = 0; i < repeatCnt; i++) {
          this.uploadFileList.push(e[i]);
        } 
      }
    });
  }

  openImageViewer(files: Array<any>, arg: number){                 // 0일경우 delete 불가, 1일 경우 delete 가능
    const param = {
      files: files,
      deletable: arg === 1 ? true : false
    }
    const config: ModalDialogOptions = {
      viewContainerRef: rootScope.vcRef,
      fullscreen: false,
      context: param
    };
    this.modalService.showModal(ImgViewerComponent, config).
    then((res)=> {
      // 마지막 하나를 지울 때는 모달 밖에서 처리해야 에러 안남
      if(res && res.delete) {
        files.pop();
      }
    });
  }

  reviewReg(){
    if(!this.session.user$.value) {
      const data = {
        title: '로그인',
        message: '로그인 후에 리뷰를 작성할 수 있습니다.',
        okButtonText: '로그인하기',
        cancelButtonText: '닫기'
      };
      confirm(data).then(res=> {
        if(res) {
          this.router.navigateByUrl('/login');
        }
      });
    }else{
      this.sendRequest();
    }
  }

  sendRequest(){
    const param = {
      MemId: this.session.user$.value.MemId,
      AcomId: this.id,
      Contents: this.typing.text,
      Score: this.typing.score,
      mapcode: 'CommunityQuery.insertReview',
      uploadFileList: this.uploadFileList,
      IdName: 'ReviewId',
      tableNm: 'review'
    };
    this.postApi.movilaInsert(param, (res)=> {
      if (res.header.status === 200) {
        this.typing = {
          score: 5,
          text: ''
        };
        this.uploadFileList = [];
        this.toast.setMsg('저장 되었습니다.');
        this.getReview();
      }
    });
  }

  getReview(){
    let param: any = {
      AcomId: this.id,
      mapcode: 'getReviewList'
    };
    
    this.postApi.home(param, (res)=> {
      if (res.header.status === 200) {
        this.list = res.body.docs[0].list;
        this.list.forEach(a=> {
          a.stars = this.makeStars(a.Score);
          a.uploadfileList.map(b=> {
            b.link = this.staticVariable.getFileDownloadUrl(b.PhysicalFileNm);
          });
        });
      }
    }); 
  }

  makeStars(score: number) {
    let stars = '';
    for(let i = 0; i < score; i++) {
      stars += '★';
    }
    return stars;
  }

  reviewDel(target) {
    const data = {
      title: '리뷰 삭제',
      message: '리뷰를 삭제하시겠습니까?',
      okButtonText: '삭제',
      cancelButtonText: '닫기'
    };
    confirm(data).then(res=> {
      if(res) {
        const data = {
          ReviewId: target.ReviewId,
          MemId: this.user.MemId,
          AcomId: this.id,
          mapcode: 'CommunityQuery.deleteReview'
        };
        this.postApi.movilaUpdate(data, (res)=> {
          if (res.header.status === 200) {
            this.toast.setMsg('삭제되었습니다');
            this.getReview();
          }
        });
      }
    });
  }
  
}
