import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgSingleComponent } from '@src/app/shared/img-single/img-single.component';

describe('ImgSingleComponent', () => {
  let component: ImgSingleComponent;
  let fixture: ComponentFixture<ImgSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
