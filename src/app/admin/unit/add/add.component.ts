import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { defaultCheckinTime, formToObj, rootScope } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { CONSTANT } from '@src/assets/global-constant';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

interface inputBoxes{
  infoAccom: string;
  infoRefund1: {
    from: number, rate: number
  },
  infoRefund2: {
    from: number, to: number, rate: number
  },
  infoNearby: string
}
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
  ]
})
export class AddComponent implements OnInit {

  formPage1: FormGroup;
  uploadFileList = [];
  page: number = 1;
  checkTime = defaultCheckinTime();
  optional: any = {
    infoAccom: [],
    infoRefund: [],
    infoNearby: [],
    infoTheme: [],
    infoFacilities: []
  };
  inputboxes: inputBoxes = {
    infoAccom: '',
    infoRefund1: {from: null, rate: null},
    infoRefund2: {from: null, to: null, rate: null},
    infoNearby: ''
  };

  editItem;
  activatedEditBtn;
  refundDay = [];
  refundRate = [];
  theme: Array<any>;
  facilities: Array<any>;
  refreshFile = 0;

  constructor(
    public matRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private postApi: PostApiService
  ) { 

    /* 환불 일자/율 초기화 */
    for(let i = 0; i < 32; i ++){
      if(i < 11){
        this.refundRate.push(i * 10);
      }
      if(i !== 0){
        this.refundDay.push(i);
      }
    }

  }

  ngOnInit(): void {
    this.initForms();
  }

  /* 폼 초기화 */
  initForms(){
    this.formPage1 = this.fb.group({
      AcomTy: ['', [
        Validators.required
      ]],
      AcomNm: ['', [
        Validators.required
      ]],
      Addr: ['', [
        Validators.required
      ]],
      Line: ['', [
        Validators.required
      ]],
    })
  }

  /* 첨부파일 컴포넌트와 데이터 sync */
  syncFileList(e){
    this.uploadFileList = [...e];
  }

  /* 다음페이지 */
  continue(index: number){
    switch(index){
      case 1:
        this.page = 2;
      break;
      case 2:
        this.getThemes();
        this.page = 3;
      break;
      case 3:
        this.getFacilities();
        this.page = 4;
      break;
    }
  }

  /* 이전 페이지 */
  prev(index: number){
    switch(index){
      case 2:
        this.page = 1;
      break;
    }
  }

  /* 숙소타입 수정 */
  changeSelection(e, selected: string){
    if(e.selected){
      this.formPage1.controls['AcomTy'].setValue(selected);
    }
  }

  srchAddr(){
    new daum.Postcode({
      oncomplete: (data)=> {
        const addr = '[' + data.zonecode + '] ' + data.address;
        this.formPage1.controls['Addr'].setValue(addr);
      },
    }).open();
  }

  /* 양식중 한 목록 추가 */
  addRule(target){

    if(target.indexOf('Refund') > 0){
      if(target.endsWith('1')){
        if(this.inputboxes[target].from != null && this.inputboxes[target].rate != null){
          this.optional['infoRefund'].push({...this.inputboxes[target]});
          this.inputboxes[target] = {from : null, rate: null};
        }
      }else{
        if(this.inputboxes[target].from != null &&  this.inputboxes[target].to != null && this.inputboxes[target].rate != null){
          this.optional['infoRefund'].push({...this.inputboxes[target]});
          this.inputboxes[target] = {from : null, to: null, rate: null};
        }
      }
    }else{
      if(this.inputboxes[target] && this.inputboxes[target]){
        this.optional[target].push(this.inputboxes[target]);
        this.inputboxes[target] = '';
      }
    }

  }

  /* 양식중 한 목록 수정 */
  editList(target, li, index){
    this.cancelEdit();
    this.editItem = li;

    if(target.indexOf('Refund') > 0){
      if(target.endsWith('1')){
        this.inputboxes['infoRefund1'] = {...this.optional[target][index]};
        this.activatedEditBtn = 'infoRefund1';
        this.inputboxes['infoRefund2'] = {from: null, to: null, rate: null};
      }else{
        this.inputboxes['infoRefund2'] = {...this.optional[target][index]};
        this.activatedEditBtn = 'infoRefund2';
        this.inputboxes['infoRefund1'] = {from: null, rate: null};
      }
    }else{
      this.inputboxes[target] = this.optional[target][index];
      this.activatedEditBtn = target;
    }

  }

  /* 목록 수정에서 삭제 */
  delList(target, index){
    this.cancelEdit();
    this.optional[target].splice(index, 1);
  }

  /* 수정중인 목록 취소 */
  cancelEdit(){
    this.editItem = null;
    this.activatedEditBtn = null;
    for(const key in this.inputboxes){
      if(key.indexOf('Refund') > 0){
        if(key.endsWith('1')){
          this.inputboxes['infoRefund1'] = {from: null, rate: null};
        }else{
          this.inputboxes['infoRefund2'] = {from: null, to: null, rate: null};
        }
      }else{
        this.inputboxes[key] = '';
      }
    }
  }

  /* 입력한 폼 수정 */
  modify(target){
    const index = this.optional[target].findIndex(a=> a === this.editItem);
    if(target.indexOf('Refund') > 0){
      if(this.editItem.to){
        this.optional[target][index] = {...this.inputboxes['infoRefund2']};
      }else{
        this.optional[target][index] = {...this.inputboxes['infoRefund1']};
      }
    }else{
      this.optional[target][index] = this.inputboxes[target];
    }
    this.cancelEdit();
  }

  /* 테마 목록 불러오는 쿼리 */
  getThemes(){
    const attr = ['ThemeId', 'ThemeNm'];
    const data = {
      attr: attr,
      mapcode: 'MovilaAccomodation.getThemes',
      useConvert: 'Y'
    }

    this.postApi.movilaSelect(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        if (res.body.docCnt > 0 && !this.theme){
          this.theme = res.body.docs;
        }
      }
    });
  }

  /* 편의시설 목록 불러오는 쿼리 */
  getFacilities(){
    const attr = ['FacId', 'FacNm'];
    const data = {
      attr: attr,
      mapcode: 'MovilaAccomodation.getFacilities',
      useConvert: 'Y'
    }

    this.postApi.movilaSelect(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        if (res.body.docCnt > 0 && !this.facilities){
          this.facilities = res.body.docs;
        }
      }
    });
  }

  /* 체크 데이터 인 아웃 */
  editCheckList(target, e, id){
    if(e.checked){
      this.optional[target].push(id);
    }else{
      this.optional[target] = this.optional[target].filter(a=> a !== id);
    }
  }

  /* 체크박스 체크 */
  onCheck(target, id){
    const result = this.optional[target].filter(a=> a === id);
    return result.length > 0;
  }

  submit(){
    const formData = formToObj(this.formPage1.controls);

    const data = { 
      uploadFileList: this.uploadFileList,
      IdName: 'AcomId',
      tableNm: 'accom',
      mapcode: 'insertAccom',
      MemId: rootScope.gVariable.MemId,
      ...formData,
      ...this.optional
    };

    console.log(data);
    this.postApi.home(data, (res)=> {
      console.log(res);
    });

  }
}
