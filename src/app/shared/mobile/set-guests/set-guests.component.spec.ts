import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetGuestsComponent } from '@src/app/shared/mobile/set-guests/set-guests.component';

describe('SetGuestsComponent', () => {
  let component: SetGuestsComponent;
  let fixture: ComponentFixture<SetGuestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetGuestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
