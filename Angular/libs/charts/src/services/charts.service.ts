import { Injectable, Type, ComponentFactoryResolver } from '@angular/core';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { ForceDirectedGraphComponent } from '../force-directed-graph/force-directed-graph.component';
import { HierarchicalEdgeBundlingComponent } from '../hierarchical-edge-bundling/hierarchical-edge-bundling.component';
import { NumberCardComponent } from '../ngx-charts';
import { GaugeChartComponent } from '../ngx-charts';
import { AdvancedPieChartComponent } from '../ngx-charts';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { DendogramComponent } from '../dendogram/dendogram.component';
import { NgGraphComponent } from '../ngx-charts';
import { TreemapChartComponent } from '../ngx-charts';
import { ZoomableTreemapChartComponent } from '../zoomable-treemap-chart/zoomable-treemap-chart.component';
import { BubbleChartComponent } from '../bubble-chart';
import { WordCloudComponent } from '../word-cloud';
import { SunburstChartComponent } from '../sunburst-chart/sunburst-chart.component';
import { AreaChartComponent } from '../ngx-charts';
import { PieGridChartComponent } from '../ngx-charts';

@Injectable()
export class ChartsService {
  private listWidget;

  constructor(private _resolver: ComponentFactoryResolver) {
    // this.listWidget = Array.from(this._resolver['_factories'].keys());

    this.listWidget = new Map<string, Type<any>>([
      ['PieChartComponent', PieChartComponent],
      ['AdvancedPieChartComponent', AdvancedPieChartComponent],
      ['BarChartComponent', BarChartComponent],
      ['ForceDirectedGraphComponent', ForceDirectedGraphComponent],
      ['GaugeChartComponent', GaugeChartComponent],
      ['HierarchicalEdgeBundlingComponent', HierarchicalEdgeBundlingComponent],
      ['LineChartComponent', LineChartComponent],
      ['PieGridChartComponent', PieGridChartComponent],
      ['DendogramComponent', DendogramComponent],
      ['NgGraphComponent', NgGraphComponent],
      ['TreemapChartComponent', TreemapChartComponent],
      ['ZoomableTreemapChartComponent', ZoomableTreemapChartComponent],
      ['BubbleChartComponent', BubbleChartComponent],
      ['SunburstChartComponent', SunburstChartComponent],
      ['AreaChartComponent', AreaChartComponent],
      ['WordCloudComponent', WordCloudComponent],
      ['NumberCardComponent', NumberCardComponent]
    ]);
  }

  getChartType(widgetType: string): Type<any> {
    const cmpType = <Type<any>>this.listWidget.get(widgetType);
    return cmpType;
    // return <Type<any>>this.listWidget.find((x: any) => x.name === widgetType);
  }
}
