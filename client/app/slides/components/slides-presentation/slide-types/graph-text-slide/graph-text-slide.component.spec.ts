import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTextSlideComponent } from './graph-text-slide.component';

describe('GraphTextSlideComponent', () => {
  let component: GraphTextSlideComponent;
  let fixture: ComponentFixture<GraphTextSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphTextSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTextSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
