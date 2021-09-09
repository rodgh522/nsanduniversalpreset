import { Component, OnInit } from '@angular/core';
import { Page, ScrollEventData, ScrollView, View } from '@nativescript/core';

@Component({
  selector: 'app-main',
  moduleId: module.id,
  templateUrl: './main.component.tns.html',
  styleUrls: ['./main.component.tns.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private _page: Page
  ) { }

  ngOnInit(): void {
  }

  onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
    // If the header content is still visiible
    // console.log(scrollView.verticalOffset);
    if (scrollView.verticalOffset < 250) {
        const offset = scrollView.verticalOffset / 2;
        if (scrollView.ios) {
            // iOS adjust the position with an animation to create a smother scrolling effect. 
            topView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
        } else {
            // Android, animations are jerky so instead just adjust the position without animation.
            topView.translateY = Math.floor(offset);
        }
    }
}
}
