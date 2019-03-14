import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodRdfCreatorComponent } from './food-rdf-creator.component';

describe('FoodRdfCreatorComponent', () => {
  let component: FoodRdfCreatorComponent;
  let fixture: ComponentFixture<FoodRdfCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodRdfCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodRdfCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
