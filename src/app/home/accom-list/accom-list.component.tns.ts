import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { getString } from '@nativescript/core/application-settings';
import { StaticVariableService } from '@src/app/global/static-variable';
import { PostApiService } from '@src/app/service/post-api.service';
import { SearchService } from '@src/app/service/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accom-list',
  templateUrl: './accom-list.component.tns.html',
  styleUrls: ['./accom-list.component.tns.scss']
})
export class AccomListComponent implements OnInit, OnDestroy {

  subscription: Array<Subscription> = [];
  dataloader = false;
  srch: any = {};
  list = [];
  recommandList = [];

  constructor(
      private routerExtensions: RouterExtensions,
      private searchService: SearchService,
      private postApi: PostApiService,
      private staticVariable: StaticVariableService,
      private router: Router
  ) {

      //Set up to get data from shared service to help moving from mocking data to real API calls in the future
  }

  ngOnInit(): void {
      this.srch = this.searchService.srch;
      this.getList();
  }
    
  ngOnDestroy(){
  }

  getList(){
    this.dataloader = true;
    this.searchService.setSearchList(this.srch);

    let param = {
      ...this.srch,
      mapcode: 'MovilaSearch.getAccomList',
      uploadFileList: [],
      tableNm: 'accom',
      IdName: 'AcomId',
      dates: this.changeFormat(this.srch.dates),
      ChCode: getString('ChCode'),
    };
      
    this.postApi.movilaSelect(param, (res)=> {
      if(res.header.status === 200) {
        this.dataloader = false;
        this.list = res.body.docs.map((a)=> {
          if(a.uploadFileList.length > 0) {
            a.link = this.staticVariable.getFileDownloadUrl(a.uploadFileList[0].PhysicalFileNm)
          } else {
            a.link = '~/assets/images/no_image.jpg'
          }
          if(a.ChPrice > 0) {
            a.price = a.ChPrice;
            a.saleRate = Math.round((a.DFTPrice - a.ChPrice) / a.DFTPrice * 100);
          }else {
            a.isDiscounted = false;
            a.price = a.DFTPrice;
          }
          return a;
        });
        this.recommandList = this.list.slice(0, 3);
      }
    });
  }
    
  changeFormat(list){
    const result = list.map((a)=> {
      var date = new Date(a);
      return {
        bookingDt: date.toStrFormat(),
        bookingDay: date.getDay()
      };
    });
    return result;
  }

  triggerSearch(){
      this.getList();
  }

  goUnit(id: string){
    this.router.navigateByUrl('unit/' + id);
  }
}
