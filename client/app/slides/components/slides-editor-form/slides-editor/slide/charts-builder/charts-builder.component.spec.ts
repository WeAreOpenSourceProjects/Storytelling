import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsBuilderComponent } from './charts-builder.component';

describe('ChartsBuilderComponent', () => {
  let component: ChartsBuilderComponent;
  let fixture: ComponentFixture<ChartsBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
