import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatTooltipModule,
  MatInputModule,
  MatCardModule,
  MatSelectModule,
  MatIconModule,
  MatButtonModule,
  MatChipsModule,
  MatToolbarModule,
  MatDialogModule,
  MatCheckboxModule,
  MatPaginatorModule
} from '@angular/material';

import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ForceDirectedGraphComponent } from './force-directed-graph/force-directed-graph.component';
import { HierarchicalEdgeBundlingComponent } from './hierarchical-edge-bundling/hierarchical-edge-bundling.component';
import { NumberCardComponent } from './ngx-charts';
import { GaugeChartComponent } from './ngx-charts';
import { AdvancedPieChartComponent } from './ngx-charts';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { DendogramComponent } from './dendogram/dendogram.component';
import { NgGraphComponent } from './ngx-charts';
import { TreemapChartComponent } from './ngx-charts';
import { ZoomableTreemapChartComponent } from './zoomable-treemap-chart/zoomable-treemap-chart.component';
import { BubbleChartComponent } from './bubble-chart';
import { WordCloudComponent } from './word-cloud';
import { SunburstChartComponent } from './sunburst-chart/sunburst-chart.component';
import { AreaChartComponent } from './ngx-charts';
import { PieGridChartComponent } from './ngx-charts';
import { PieChartModule, GaugeModule, NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphComponent } from './graph/graph.component';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatToolbarModule,
    MatInputModule,
    PieChartModule,
    GaugeModule,
    NgxChartsModule
  ],

  declarations: [
    LineChartComponent,
    ForceDirectedGraphComponent,
    HierarchicalEdgeBundlingComponent,
    NumberCardComponent,
    GaugeChartComponent,
    AdvancedPieChartComponent,
    PieChartComponent,
    DendogramComponent,
    NgGraphComponent,
    TreemapChartComponent,
    ZoomableTreemapChartComponent,
    BubbleChartComponent,
    WordCloudComponent,
    SunburstChartComponent,
    AreaChartComponent,
    PieGridChartComponent,
    BarChartComponent,
    GraphComponent
  ],
  exports: [
    LineChartComponent,
    ForceDirectedGraphComponent,
    HierarchicalEdgeBundlingComponent,
    NumberCardComponent,
    GaugeChartComponent,
    AdvancedPieChartComponent,
    PieChartComponent,
    DendogramComponent,
    NgGraphComponent,
    TreemapChartComponent,
    ZoomableTreemapChartComponent,
    BubbleChartComponent,
    WordCloudComponent,
    SunburstChartComponent,
    AreaChartComponent,
    BarChartComponent,
    GraphComponent
  ]
})
export class ChartsModule {}
