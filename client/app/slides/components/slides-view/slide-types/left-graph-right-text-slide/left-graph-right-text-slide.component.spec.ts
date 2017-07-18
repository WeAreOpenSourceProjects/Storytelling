import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftGraphRightTextSlideComponent } from './left-graph-right-text-slide.component';

describe('LeftGraphRightTextSlideComponent', () => {
  let component: LeftGraphRightTextSlideComponent;
  let fixture: ComponentFixture<LeftGraphRightTextSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftGraphRightTextSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftGraphRightTextSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
