import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrandsProductComponent } from './add-brands-product.component';

describe('AddBrandsProductComponent', () => {
  let component: AddBrandsProductComponent;
  let fixture: ComponentFixture<AddBrandsProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBrandsProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrandsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
