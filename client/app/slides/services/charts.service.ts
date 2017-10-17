import { Injectable, Type, ComponentFactoryResolver } from '@angular/core';
import {
  PieChartComponent, AdvancedPieChartComponent, BarChartComponent, ForceDirectedGraphComponent,
  GaugeChartComponent, HierarchicalEdgeBundlingComponent, LineChartComponent, DendogramComponent,
  NgGraphComponent, TreemapChartComponent, ZoomableTreemapChartComponent, PieGridChartComponent,
  BubbleChartComponent, SunburstChartComponent, WordCloudComponent, AreaChartComponent, NumberCardComponent

} from 'app/charts';

@Injectable()
export class ChartsService {
  private listWidget;

  constructor(private _resolver: ComponentFactoryResolver) {
    // this.listWidget = Array.from(this._resolver['_factories'].keys());

    this.listWidget = new Map<string, Type<any>>([['PieChartComponent', PieChartComponent],
      ['AdvancedPieChartComponent', AdvancedPieChartComponent], ['BarChartComponent', BarChartComponent],
      ['ForceDirectedGraphComponent', ForceDirectedGraphComponent], ['GaugeChartComponent', GaugeChartComponent],
      ['HierarchicalEdgeBundlingComponent', HierarchicalEdgeBundlingComponent], ['LineChartComponent', LineChartComponent],
      ['PieGridChartComponent', PieGridChartComponent], ['DendogramComponent', DendogramComponent],
      ['NgGraphComponent', NgGraphComponent], ['TreemapChartComponent', TreemapChartComponent],
      ['ZoomableTreemapChartComponent', ZoomableTreemapChartComponent], ['BubbleChartComponent', BubbleChartComponent],
      ['SunburstChartComponent', SunburstChartComponent], ['AreaChartComponent', AreaChartComponent],
      ['WordCloudComponent', WordCloudComponent], ['NumberCardComponent', NumberCardComponent]
    ]);
  }

  getChartType(widgetType: string): Type<any> {
    const cmpType = <Type<any>>this.listWidget.get(widgetType);
    return cmpType;
    // return <Type<any>>this.listWidget.find((x: any) => x.name === widgetType);

  }


}
