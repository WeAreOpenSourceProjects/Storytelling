import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberCardComponent } from './number-card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('NumberCardComponent', () => {
  let component: NumberCardComponent;
  let fixture: ComponentFixture<NumberCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberCardComponent ],
      imports: [NgxChartsModule, BrowserAnimationsModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
