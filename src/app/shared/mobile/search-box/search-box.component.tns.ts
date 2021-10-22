import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { action } from '@nativescript/core';
import { isNullOrEmpty } from '@src/app/global/global';
import { SearchService } from '@src/app/service/search.service';
import { DatePickerComponent } from '../date-picker/date-picker.component.tns';
import { SetGuestsComponent } from '../set-guests/set-guests.component.tns';

const today = new Date();

@Component({
  selector: 'ns-search-box',
  templateUrl: './search-box.component.tns.html',
  styleUrls: ['./search-box.component.tns.scss']
})
export class SearchBoxComponent implements OnInit {

  srch: any = {};
  toggle: any = {};
  area = '전국';
  guest = 2;
  startDate = today;
  endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  constructor(
    private modalService: ModalDialogService,
    private vref: ViewContainerRef,
    private router: RouterExtensions,
    private searchService: SearchService
  ) { 
  }
  
  ngOnInit(): void {
    this.srch = isNullOrEmpty(this.searchService.srch) ? 
    {
      GuestMax: 2,
      dates: [this.startDate],
      straight: 1,
      Sido: ''
    } 
    : this.searchService.srch
    console.log(this.srch);
  }

  searchArea(){
    action('지역선택', '취소', ['전국', '서울/경기/인천', '충청북도/충청남도']).
    then((res)=> {
      this.area = res !== '취소' ? res : this.area;
      this.srch.Sido = this.area.split('/');
    });
  }

  setGuests(){
    const config: ModalDialogOptions = {
      viewContainerRef: this.vref,
      context: this.guest
    };
    this.modalService.showModal(SetGuestsComponent, config).
    then((res)=> {
      res ? this.srch.GuestMax = this.guest = res : '';
    });
  }

  openCalendar(){
    const config: ModalDialogOptions = {
      viewContainerRef: this.vref,
      fullscreen: true
    };
    this.modalService.showModal(DatePickerComponent, config).
    then((res)=> {
      if(res) {
        this.setDate(res);
      }
    });
  }

  setDate(range: any){
    
    if(range.startDate === '') {
      return;
    }

    this.startDate = new Date(range.startDate);
    this.endDate = range.endDate ? new Date(range.endDate) : new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + 1);
    this.makeDateRange();
  }

  makeDateRange(){
    this.srch.dates = [];
    let date = this.startDate;
    while(date < this.endDate) {
      this.srch.dates.push(date);
      date = new Date(Date.parse(date.toString()) + 1000 * 60 * 60 * 24);
    }
    this.srch.straight = this.srch.dates.length;
  }

  getSearch(){
    this.searchService.srch = this.srch;
    this.router.navigateByUrl('accom');
  }

}
