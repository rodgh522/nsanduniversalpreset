import { Component, Input, OnInit } from '@angular/core';
import { SessionService } from '@src/app/service/session.service.tns';
import { confirm } from '@nativescript/core';
import { Router } from '@angular/router';
import { MobileToastService } from '@src/app/service/mobile-toast.service.tns';
import { PostApiService } from '@src/app/service/post-api.service.tns';

@Component({
  selector: 'ns-inquiry',
  templateUrl: './inquiry.component.tns.html',
  styleUrls: ['./inquiry.component.tns.scss']
})
export class InquiryComponent implements OnInit {

  @Input('id') id: string;
  text = '';
  user: any;
  list = [];

  constructor(
    private session: SessionService,
    private toast: MobileToastService,
    private postApi: PostApiService,
    private router: Router
  ) { 
    this.user = this.session.user$.value;
  }

  ngOnInit(): void {
    this.getQuestion();
  }

  questionReg(){
    if(this.text === ''){
      this.toast.setMsg('문의 내용을 입력해주세요');
      return;
    }

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
      Contents: this.text,
      mapcode: 'CommunityQuery.insertQuestion',
    };
    this.postApi.movilaInsert(param, (res)=> {
      if (res.header.status === 200) {
        this.toast.setMsg('등록되었습니다');
        this.text = '';

        this.getQuestion();
      }
    });
  }

  getQuestion(){
    let param: any = {
      AcomId: this.id,
      mapcode: 'getQuestionList'
    };
    
    this.postApi.home(param, (res)=> {
      if (res.header.status === 200) {
        this.list = res.body.docs[0].list;
        this.list.forEach(a=> {
          this.getQuestionComment(a);
        });
        console.log(this.list);
      }
    }); 
  }

  getQuestionComment(list) {
    let param: any = {
      AcomId: this.id,
      QuestionId: list.QuestionId,
      mapcode: 'CommunityQuery.getQuestionComment'
    };
    this.postApi.movilaSelect(param, (res)=> {
      if (res.header.status === 200) {
        if (res.body.docCnt > 0) {
          list['reply'] = res.body.docs;
        }
      }
    });
  }

  questionDel(target) {
    const data = {
      title: '문의 삭제',
      message: '문의를 삭제하시겠습니까?',
      okButtonText: '삭제',
      cancelButtonText: '닫기'
    };

    confirm(data).then(res=> {
      if(res) {
        const data = {
          QuestionId: target.QuestionId,
          MemId: this.user.MemId,
          AcomId: this.id,
          mapcode: 'CommunityQuery.deleteQuestion'
        };
        this.postApi.movilaUpdate(data, (res)=> {
          if (res.header.status === 200) {
            this.toast.setMsg('삭제되었습니다');
            this.getQuestion();
          }
        });
      }
    });
  }
}
