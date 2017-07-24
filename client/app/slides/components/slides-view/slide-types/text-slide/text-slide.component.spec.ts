import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Slide } from '../../../../models';
import { TextSlideComponent } from './text-slide.component';

describe('TextSlideComponent', () => {
  let component: TextSlideComponent;
  let fixture: ComponentFixture<TextSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSlideComponent);
    component = fixture.componentInstance;
    component.slide =     {
      "config" : {},
        "pageTitle" : {
        "align" : "",
        "title" : "ddd"
      },
      "hasText" : true,
      "hasGraph" : false,
      "data" : [
        null
      ],
      "pageLayout" : "textInCenter",
      "graph" : "",
      "textVerAlign" : "TOP",
      "text" : "<p>dsbgsdfbfds</p>",
      "index" : 1,
      'fullScreenHtml' : false,
      'slideImage': null
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
