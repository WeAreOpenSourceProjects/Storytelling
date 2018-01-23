import {
  Component,
  OnInit,
  AfterContentInit,
  OnChanges,
  DoCheck,
  ElementRef,
  Input,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';

import { Chart } from '@labdat/charts/src/chart.class';
import { ChartsService } from '@labdat/charts/src/services/charts.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterContentInit, OnChanges {
  @Input() chart: any;
  @Input() width: number;
  @Input() height: number;

  @ViewChild('parent', { read: ViewContainerRef })
  parent: ViewContainerRef;
  componentRef: ComponentRef<any>;
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
   private chartsService: ChartsService
   ) {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.resolveCmp();
  }
  ngOnChanges() {
    this.resolveCmp();
  }
  private resolveCmp() {
    let cmpName: string;
    if (this.chart.chartOptions.chartType && this.chart.chartOptions.chartType.cmpName != null) {
      cmpName = this.chart.chartOptions.chartType.cmpName;
    }
    let cmpType: string = cmpName.charAt(0).toUpperCase() + cmpName.slice(1) + 'Component';
    this.setChart(cmpType);
  }

  private setChart(chartType: string) {
    if (this.parent) this.parent.clear();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    if (this.chartsService.getChartType(chartType) === undefined) return;
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      this.chartsService.getChartType(chartType)
    );
    this.componentRef = this.parent.createComponent(componentFactory);
    this.componentRef.instance.dataInput = this.chart.data; // set the input inputData of the abstract class Chart
    this.componentRef.instance.configInput = this.chart.chartOptions;
  }
}
