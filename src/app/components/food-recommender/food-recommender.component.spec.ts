import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodRecommenderComponent } from './food-recommender.component';

describe('FoodRecommenderComponent', () => {
  let component: FoodRecommenderComponent;
  let fixture: ComponentFixture<FoodRecommenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodRecommenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodRecommenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
