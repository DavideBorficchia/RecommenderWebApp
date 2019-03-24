import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalActivityCreatorComponent } from './physical-activity-creator.component';

describe('PhysicalActivityCreatorComponent', () => {
  let component: PhysicalActivityCreatorComponent;
  let fixture: ComponentFixture<PhysicalActivityCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalActivityCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalActivityCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
