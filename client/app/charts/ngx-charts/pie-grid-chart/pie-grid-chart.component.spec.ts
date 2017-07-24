import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieGridChartComponent } from './pie-grid-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('PieGridChartComponent', () => {
  let component: PieGridChartComponent;
  let fixture: ComponentFixture<PieGridChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieGridChartComponent ],
      imports: [NgxChartsModule, BrowserAnimationsModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieGridChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
