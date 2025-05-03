import { TestBed } from '@angular/core/testing';

import { RoleRequestService } from './role-request.service';

describe('RoleRequestService', () => {
  let service: RoleRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
