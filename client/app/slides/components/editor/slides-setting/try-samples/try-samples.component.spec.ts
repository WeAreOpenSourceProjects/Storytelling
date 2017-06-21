import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrySamplesComponent } from './try-samples.component';

describe('TrySamplesComponent', () => {
  let component: TrySamplesComponent;
  let fixture: ComponentFixture<TrySamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrySamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrySamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
