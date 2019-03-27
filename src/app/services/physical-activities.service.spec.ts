import { TestBed } from '@angular/core/testing';

import { PhysicalActivitiesService } from './physical-activities.service';

describe('PhysicalActivitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhysicalActivitiesService = TestBed.get(PhysicalActivitiesService);
    expect(service).toBeTruthy();
  });
});
