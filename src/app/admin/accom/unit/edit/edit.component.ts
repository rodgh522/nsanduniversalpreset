import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formToObj, objToForm, rootScope, validCheck } from '@src/app/global/global';
import { PostApiService } from '@src/app/service/post-api.service';
import { CONSTANT } from '@src/assets/global-constant';

const priceDefault = {
  WeekdayPrice: 0,
  FridayPrice: 0,
  WeekendPrice: 0
};
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  animations: [
    trigger('focusTab', [
      state('focused', style({'backgroundColor': 'rgba(25, 115, 232, 0.1)', 'color': '#0a43ff'})),
      state('focusout', style({'backgroundColor': '*', 'color': '*'}))
    ])
  ]
})
export class EditComponent implements OnInit {

  formunit: FormGroup;
  formprice: FormGroup;
  facilities: Array<any>;
  prices: any = {
    NORMAL: {},
    BUSY: {...priceDefault},
    HECTIC: {...priceDefault},
    SALE: {...priceDefault},
    SPECIFIC: {...priceDefault},
  };
  optional: any = {
    facilities: [],
    infoUnit: []
  };
  inputboxes = {
    infoUnit: ''
  };
  editItem;
  activatedEditBtn;
  container;
  selectedTab = 0;
  title = '객실정보';

  mainImage = {};
  subImgs = [];
  unitId;
  constructor(
    private fb: FormBuilder,
    private postApi: PostApiService,
    private actRouter: ActivatedRoute,
    private router: Router
  ) { 
    this.container = rootScope.windowSize;
    this.unitId = this.actRouter.snapshot.params.keyId;
  }

  ngOnInit(): void {
    this.formInit();
    this.getCommon();
    if (this.unitId) {
      this.getUnitDetail();
    }
  }

  formInit(){
    this.formunit = this.fb.group({
      UnitNm: ['', [
        Validators.required
      ]],
      UnitWidth: ['', []],
      GuestStd: ['', [
        Validators.required
      ]],
      GuestMax: ['', [
        Validators.required
      ]],
    });

    this.formprice = this.fb.group({
      WeekdayPrice: ['0', [
        Validators.required,
        Validators.pattern(/[^0]/)
      ]],
      FridayPrice: ['0', [
        Validators.pattern(/[^0]/),
        Validators.required
      ]],
      WeekendPrice: ['0', [
        Validators.pattern(/[^0]/),
        Validators.required
      ]],
    });
  }

  getUnitDetail(){
    const attr = [
      'UnitNm', 'UnitWidth', 'GuestStd', 'GuestMax', 'UseYN'
    ];
    
    const data = {
      attr: attr,
      mapcode: 'getUnitDetail',
      useConvert: 'Y',
      UnitId: this.unitId
    };

    this.postApi.home(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        if (res.body.docCnt > 0) {
          const info = res.body.docs[0];
          this.optional = {
            facilities: info.facilities.map(a=> a.FacId),
            infoUnit: info.infoUnit.map(a=> a.Content)
          };

          this.formunit.controls = objToForm(info, this.formunit.controls);
          console.log(res);
        }
      }
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

  setBaseInfo(){
    if(validCheck(this.formunit.controls)){
      for(const key in this.formunit.controls){
        if(this.formunit.controls[key]){
          this.formunit.controls[key].markAsTouched();
        }
      }
      return;
    }

    const data = {
      AcomId: rootScope.gVariable.AcomId,
      mapcode: 'setUnitBaseInfo',
      ...formToObj(this.formunit.controls),
      ...this.optional
    };
    if(this.unitId){

    }else{
      this.postApi.home(data, (res)=> {
        if (res.header.status === CONSTANT.HttpStatus.OK) {
          this.router.navigateByUrl('/admin/accom/unit-list');
        }
      });
    }
  }

  setPriceInfo(){
    if(validCheck(this.formprice.controls)){
      for(const key in this.formprice.controls){
        if(this.formprice.controls[key]){
          this.formprice.controls[key].markAsTouched();
        }
      }
      return;
    }
    this.prices.NORMAL = formToObj(this.formprice.controls);
    const prices = this.prepPriceData(this.prices);
    const data = {
      UnitId: this.unitId,
      prices: prices,
      mapcode: 'MovilaAccomodation.inserUnitPrice'
    };
    this.postApi.movilaInsert(data, (res)=> {
      console.log(res);
    });
  }

  prepPriceData(data: any){
    const result = [];
    for(const row1 in data){
      let temp = {};
      for(const row2 in data[row1]){
        if(data[row1][row2] != 0){
          temp[row2] = parseInt(data[row1][row2].replaceAll(/[^0-9]/, ""));
        }else{
          temp[row2] = 0;
        }
      }
      temp['SeasonCode'] = row1;
      result.push(temp);
    }
    return result;
  }

  getPriceInfo(){
    const attr = [
      'SeasonCode', 'WeekdayPrice', 'FridayPrice', 'WeekendPrice'
    ];
    
    const data = {
      attr: attr,
      mapcode: 'getUnitPrice',
      useConvert: 'Y',
      UnitId: this.unitId
    };

    this.postApi.movilaSelect(data, (res)=> {
      if (res.header.status === CONSTANT.HttpStatus.OK) {
        if (res.body.docCnt > 0) {
          this.setPriceData(res.body.docs);
        }
      }
    });
  }

  setPriceData(data: Array<any>){
    data.forEach(a=> {
      const code = a.SeasonCode;
      if(code === 'NORMAL'){
        this.formprice.controls = objToForm(a, this.formprice.controls);
      }else{
        for(const key in a){
          if (key !== 'SeasonCode') {
            this.prices[code][key] = a[key];
          }
        }
      }
    });
  }
}
