import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DietCreatorComponent } from './diet-creator.component';

describe('DietCreatorComponent', () => {
  let component: DietCreatorComponent;
  let fixture: ComponentFixture<DietCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DietCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DietCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
