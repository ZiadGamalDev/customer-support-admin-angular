import { TestBed } from '@angular/core/testing';

import { AgentProfileService } from './agent.profile.service';

describe('AgentProfileService', () => {
  let service: AgentProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
