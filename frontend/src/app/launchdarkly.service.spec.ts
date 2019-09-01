import { TestBed } from '@angular/core/testing';

import { LaunchdarklyService } from './launchdarkly.service';

describe('LaunchdarklyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaunchdarklyService = TestBed.get(LaunchdarklyService);
    expect(service).toBeTruthy();
  });
});
