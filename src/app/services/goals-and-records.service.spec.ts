import { TestBed } from '@angular/core/testing';

import { GoalsAndRecordsService } from './goals-and-records.service';

describe('GoalsAndRecordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoalsAndRecordsService = TestBed.get(GoalsAndRecordsService);
    expect(service).toBeTruthy();
  });
});
