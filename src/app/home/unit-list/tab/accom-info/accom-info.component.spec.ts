import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomInfoComponent } from '@src/app/home/unit-list/tab/accom-info/accom-info.component.tns';

describe('AccomInfoComponent', () => {
  let component: AccomInfoComponent;
  let fixture: ComponentFixture<AccomInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccomInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccomInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
