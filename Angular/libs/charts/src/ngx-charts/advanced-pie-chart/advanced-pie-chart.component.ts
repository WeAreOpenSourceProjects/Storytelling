import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from '../../chart.class';
import { formatLabel } from '@swimlane/ngx-charts/';
import { nest } from 'd3-collection';
import * as d3 from 'd3';

const defaultOptions = {};
@Component({
  selector: 'app-advanced-pie-chart',
  templateUrl: './advanced-pie-chart.component.html',
  styleUrls: ['./advanced-pie-chart.component.scss']
})
export class AdvancedPieChartComponent extends Chart implements OnInit, OnDestroy {
  data: Array<any> = [];
  @ViewChild('chart') private chartContainer: ElementRef;
  activated = false;
  chartOptions: any;
  private width: number;
  private height: number;
  private _setIntervalHandler: any;
  view: null;
  colorScheme = {
    name: 'pie',
    selectable: true,
    group: 'Ordinal',
    domain: ['#3498db', '#74b9ff', '#f39c12', '#fed330', '#27ae60', '#a3cb38', '#ee5a24', '#fa8231',
    '#8e44ad', '#9c88ff', '#079992', '#7bc8a4', '#b71540', '#eb4d4b', '#34495e', '#487eb0', '#7f8c8d', '#bdc3c7']
  };
  gradient = false;
  tooltipDisabled = false;

  // margin
  private margin: any = { top: 30, bottom: 20, left: 40, right: 40 };

  constructor() {
    super();
  }

  ngOnInit() {
    this.chartOptions = { ...defaultOptions, ...this.configInput };
  }
  ngAfterViewInit() {
    let element = this.chartContainer.nativeElement;
    // Set the config
    setTimeout(() => {
      d3
        .select(element)
        .select('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr(
          'viewBox',
          '0  ' + element.offsetHeight / 3 + ' ' + element.offsetWidth / 3 + ' ' + element.offsetHeight / 3
        );
      this.init();
      this.activated = true;
    });
  }

  init() {
    if (this.configInput != null)
      this.data = AdvancedPieChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    else this.data = this.dataInput;
  }

  public static convertData(dataDims: string[], rawData: any) {
    const key$ = d => d[dataDims[0]];
    const value$ = d => d3.sum(d, (s: any) => s[dataDims[1]]);

    return (<any>nest())
      .key(key$)
      .rollup(value$)
      .entries(rawData)
      .map(seriesPoints);

    function seriesPoints(d) {
      return {
        name: d.key,
        value: d.value
      };
    }
  }

  select(data) {
    console.log('Item clicked', data);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  ngOnDestroy() {
    clearTimeout(this._setIntervalHandler);
  }
}
