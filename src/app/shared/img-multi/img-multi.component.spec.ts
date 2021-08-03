import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgMultiComponent } from '@src/app/shared/img-multi/img-multi.component';

describe('ImgMultiComponent', () => {
  let component: ImgMultiComponent;
  let fixture: ComponentFixture<ImgMultiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgMultiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
