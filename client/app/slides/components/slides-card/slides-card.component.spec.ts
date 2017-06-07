import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesCardComponent } from './slides-card.component';

describe('SlidesCardComponent', () => {
  let component: SlidesCardComponent;
  let fixture: ComponentFixture<SlidesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
