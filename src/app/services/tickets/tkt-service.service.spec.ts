import { TestBed } from '@angular/core/testing';

import { TktServiceService } from './tkt-service.service';

describe('TktServiceService', () => {
  let service: TktServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TktServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
