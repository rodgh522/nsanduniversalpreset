import { Component, Input, OnInit } from '@angular/core';
import { PostApiService } from '@src/app/service/post-api.service.tns';

@Component({
  selector: 'ns-accom-info',
  templateUrl: './accom-info.component.tns.html',
  styleUrls: ['./accom-info.component.tns.scss']
})
export class AccomInfoComponent implements OnInit {

  @Input('id') id: string;
  
  info: any = {};
  constructor(
    private postApi: PostApiService
  ) { }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo() {
    const param = {
      AcomId: this.id,
      mapcode: 'getAcomInfo'
    }
    this.postApi.home(param, (res)=> {
      if(res.header.status === 200) {
        this.info = res.body.docs[0];
      }
    });
  }

  execStr(list){
    let result = '';
    list.forEach((a, i)=> {
      result += a.CodeValue;
      if(list.length !== i + 1){
        result += ', ';
      }
    });
    return result;
  }
}
