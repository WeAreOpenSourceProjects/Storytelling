import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalEdgeBundlingComponent } from './hierarchical-edge-bundling.component';

describe('HierarchicalEdgeBundlingComponent', () => {
  let component: HierarchicalEdgeBundlingComponent;
  let fixture: ComponentFixture<HierarchicalEdgeBundlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchicalEdgeBundlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchicalEdgeBundlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
