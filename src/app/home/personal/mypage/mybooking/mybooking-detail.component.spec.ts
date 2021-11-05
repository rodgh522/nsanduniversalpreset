import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MybookingDetailComponent } from '@src/app/home/personal/mypage/mybooking/mybooking-detail.component';

describe('MybookingDetailComponent', () => {
  let component: MybookingDetailComponent;
  let fixture: ComponentFixture<MybookingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MybookingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MybookingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
