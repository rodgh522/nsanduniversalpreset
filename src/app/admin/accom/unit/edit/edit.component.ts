import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostApiService } from '@src/app/service/post-api.service';
import { CONSTANT } from '@src/assets/global-constant';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  formunit: FormGroup;
  facilities: Array<any>;
  optional: any = {
    facilities: [],
    infoUnit: []
  };
  inputboxes = {
    infoUnit: ''
  };
  editItem;
  activatedEditBtn;
  listView = 150;
  constructor(
    private fb: FormBuilder,
    private postApi: PostApiService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getCommon();
  }

  formInit(){
    this.formunit = this.fb.group({
      UnitNm: ['', [
        Validators.required
      ]],
      UnitWidth: ['', []],
      GuestStd: ['', []],
      GuestMax: ['', []],
    });
  }

  /* 테마 목록 불러오는 쿼리 */
  getCommon(){
    const attr = ['FacId', 'FacNm'];
    const data = {
      attr: attr,
      mapcode: 'MovilaAccomodation.getCommons',
      useConvert: 'Y',
      target: 'facility_unit'
    }

    this.postApi.movilaSelect(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        if (res.body.docCnt > 0 && !this.facilities){
          this.facilities = res.body.docs;
        }
      }
    });
  }

  /* 체크박스 체크 */
  onCheck(target, id){
    const result = this.optional[target].filter(a=> a === id);
    return result.length > 0;
  }

  /* 체크 데이터 인 아웃 */
  editCheckList(target, e, id){
    if(e.checked){
      this.optional[target].push(id);
    }else{
      this.optional[target] = this.optional[target].filter(a=> a !== id);
    }
  }

  /* 양식중 한 목록 추가 */
  addRule(target){
    if(this.inputboxes[target] && this.inputboxes[target]){
      this.optional[target].push(this.inputboxes[target]);
      this.inputboxes[target] = '';
    }
  }

  /* 양식중 한 목록 수정 */
  editList(target, li, index){
    this.cancelEdit();
    this.editItem = li;

    this.inputboxes[target] = this.optional[target][index];
    this.activatedEditBtn = target;
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
      this.inputboxes[key] = '';
    }
  }

  /* 입력한 폼 수정 */
  modify(target){
    const index = this.optional[target].findIndex(a=> a === this.editItem);
    this.optional[target][index] = this.inputboxes[target];
    this.cancelEdit();
  }
}
