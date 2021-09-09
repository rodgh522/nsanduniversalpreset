import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedIndexChangedEventData } from '@nativescript/core/ui/tab-view';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.tns.html',
  styleUrls: ['./footer.component.tns.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('true');
  }

  onBottomNavTap(url: string): void {
    this.router.navigateByUrl(url);
  }
}
