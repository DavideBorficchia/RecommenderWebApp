import { TestBed } from '@angular/core/testing';

import { PhysicalActivityService } from './physical-activity.service';

describe('PhysicalActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhysicalActivityService = TestBed.get(PhysicalActivityService);
    expect(service).toBeTruthy();
  });
});
