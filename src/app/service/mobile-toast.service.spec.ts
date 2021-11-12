import { TestBed } from '@angular/core/testing';

import { MobileToastService } from './mobile-toast.service.tns';

describe('MobileToastService', () => {
  let service: MobileToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
