import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesSearchComponent } from './slides-search.component';

describe('SlidesSearchComponent', () => {
  let component: SlidesSearchComponent;
  let fixture: ComponentFixture<SlidesSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
