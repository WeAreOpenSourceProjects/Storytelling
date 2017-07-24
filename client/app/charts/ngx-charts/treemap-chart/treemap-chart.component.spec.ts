import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreemapChartComponent } from './treemap-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('TreemapChartComponent', () => {
  let component: TreemapChartComponent;
  let fixture: ComponentFixture<TreemapChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreemapChartComponent ],
      imports: [NgxChartsModule, BrowserAnimationsModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreemapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
