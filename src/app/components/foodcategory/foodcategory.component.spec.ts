import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodcategoryComponent } from './foodcategory.component';

describe('FoodcategoryComponent', () => {
  let component: FoodcategoryComponent;
  let fixture: ComponentFixture<FoodcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
