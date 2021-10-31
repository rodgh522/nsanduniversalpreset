import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { create, NgxDateRange } from 'nativescript-ngx-date-range';
import { Options } from 'nativescript-ngx-date-range/ngx-date-range.common';

@Component({
  selector: 'ns-date-picker',
  templateUrl: './date-picker.component.tns.html',
  styleUrls: ['./date-picker.component.tns.scss']
})
export class DatePickerComponent implements OnInit {

  dateRange: NgxDateRange;
  
  constructor(
    private modalRef: ModalDialogParams
  ) { }

  ngOnInit(): void {
    const options: Options = {
      selectionMode: 'RANGE',
      disablePrevDates: true,
      simpleDateFormat: 'YYYY MMMM',
      selectToday: true,
      language: {
        countryCode: 'KOR',
        languageCode: 'kor',
      },
    };
    this.dateRange = create(options);
  }

  close(action){    
    action ? 
        this.modalRef.closeCallback(this.dateRange.getSelectedDates())
      : this.modalRef.closeCallback();
  }
}
