import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeChartComponent } from './gauge-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('GaugeChartComponent', () => {
  let component: GaugeChartComponent;
  let fixture: ComponentFixture<GaugeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeChartComponent ],
      imports: [NgxChartsModule, BrowserAnimationsModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
