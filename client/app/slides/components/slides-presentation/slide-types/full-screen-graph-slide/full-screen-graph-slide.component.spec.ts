import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenGraphSlideComponent } from './full-screen-graph-slide.component';

describe('FullScreenChartSlideComponent', () => {
  let component: FullScreenGraphSlideComponent;
  let fixture: ComponentFixture<FullScreenGraphSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullScreenGraphSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenGraphSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
