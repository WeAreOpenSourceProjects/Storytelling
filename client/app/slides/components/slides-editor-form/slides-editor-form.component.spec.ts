import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesEditorFormComponent } from './slides-editor-form.component';

describe('SlidesEditorFormComponent', () => {
  let component: SlidesEditorFormComponent;
  let fixture: ComponentFixture<SlidesEditorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesEditorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesEditorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
