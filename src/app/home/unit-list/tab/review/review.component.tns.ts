import { Component, Input, OnInit } from '@angular/core';
import { ImageAsset } from '@nativescript/core';
import { create, ImagePickerMediaType } from '@nativescript/imagepicker';
import { ImageSource } from '@nativescript/core/image-source';

@Component({
  selector: 'ns-review',
  templateUrl: './review.component.tns.html',
  styleUrls: ['./review.component.tns.scss']
})
export class ReviewComponent implements OnInit {

  @Input('id') id: string;
  typing: any = {
    selected: 5,
    text: ''
  }
  path = '';
  constructor() { }

  ngOnInit(): void {
  }

  searchPhoto(){
    console.log('photo');
    const context = create({
      mode: 'multiple',
      mediaType: ImagePickerMediaType.Image
    });
    context.authorize().then(()=> {
      context.present().then((res: ImageAsset[]) => {
        // console.dir(res[0].android);
        // this.path = res[0].android;
        ImageSource.fromAsset(res[0]).then((image)=> {
          console.dir(image.toBase64String('png'));
        });
      });
    });
  }

}
