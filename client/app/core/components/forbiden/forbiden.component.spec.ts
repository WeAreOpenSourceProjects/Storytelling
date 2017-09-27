import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbidenComponent } from './forbiden.component';

describe('ForbidenComponent', () => {
  let component: ForbidenComponent;
  let fixture: ComponentFixture<ForbidenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForbidenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbidenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
