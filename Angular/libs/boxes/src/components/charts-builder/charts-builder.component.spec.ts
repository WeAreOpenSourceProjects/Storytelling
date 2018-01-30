import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsBuilderComponent } from './charts-builder.component';
import { DataTableComponent } from '../data-table';
import { CodemirrorModule } from 'ng2-codemirror';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ng2-dnd';
//import { HotTableModule } from 'ng2-handsontable';

import {
  BarChartComponent,
  BubbleChartComponent,
  DendogramComponent,
  ForceDirectedGraphComponent,
  HierarchicalEdgeBundlingComponent,
  LineChartComponent,
  PieChartComponent,
  SunburstChartComponent,
  WordCloudComponent,
  ZoomableTreemapChartComponent,
  AdvancedPieChartComponent,
  AreaChartComponent,
  GaugeChartComponent,
  NumberCardComponent,
  PieGridChartComponent,
  TreemapChartComponent
} from '@labdat/charts';

import { NgxChartsModule } from '@swimlane/ngx-charts';

describe('ChartsBuilderComponent', () => {
  let component: ChartsBuilderComponent;
  let fixture: ComponentFixture<ChartsBuilderComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          ChartsBuilderComponent,
          DataTableComponent,
          BarChartComponent,
          BubbleChartComponent,
          DendogramComponent,
          ForceDirectedGraphComponent,
          HierarchicalEdgeBundlingComponent,
          LineChartComponent,
          PieChartComponent,
          SunburstChartComponent,
          WordCloudComponent,
          ZoomableTreemapChartComponent,
          AdvancedPieChartComponent,
          AreaChartComponent,
          GaugeChartComponent,
          NumberCardComponent,
          PieGridChartComponent,
          TreemapChartComponent
        ],
        imports: [NgxChartsModule, CodemirrorModule, FormsModule, DndModule.forRoot()]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
