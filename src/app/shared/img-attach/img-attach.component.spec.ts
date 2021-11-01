import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgAttachComponent } from '@src/app/shared/img-attach/img-attach.component';

describe('ImgAttachComponent', () => {
  let component: ImgAttachComponent;
  let fixture: ComponentFixture<ImgAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgAttachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
