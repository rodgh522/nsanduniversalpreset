import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomComponent } from '@src/app/admin/accom/accom.component';

describe('AccomComponent', () => {
  let component: AccomComponent;
  let fixture: ComponentFixture<AccomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
