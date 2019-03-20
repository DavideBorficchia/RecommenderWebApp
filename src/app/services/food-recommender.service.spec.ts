import { TestBed } from '@angular/core/testing';

import { FoodRecommenderService } from './food-recommender.service';

describe('FoodRecommenderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodRecommenderService = TestBed.get(FoodRecommenderService);
    expect(service).toBeTruthy();
  });
});
