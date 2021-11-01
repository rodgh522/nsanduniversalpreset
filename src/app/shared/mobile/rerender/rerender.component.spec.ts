import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RerenderComponent } from '@src/app/shared/mobile/rerender/rerender.component';

describe('RerenderComponent', () => {
  let component: RerenderComponent;
  let fixture: ComponentFixture<RerenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RerenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RerenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
