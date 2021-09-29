import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomListComponent } from '@src/app/home/accom-list/accom-list.component';

describe('AccomListComponent', () => {
  let component: AccomListComponent;
  let fixture: ComponentFixture<AccomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccomListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
