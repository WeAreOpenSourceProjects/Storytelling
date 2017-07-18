import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightGraphLeftTextSlideComponent } from './right-graph-left-text-slide.component';

describe('RightGraphLeftTextSlideComponent', () => {
  let component: RightGraphLeftTextSlideComponent;
  let fixture: ComponentFixture<RightGraphLeftTextSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightGraphLeftTextSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightGraphLeftTextSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
