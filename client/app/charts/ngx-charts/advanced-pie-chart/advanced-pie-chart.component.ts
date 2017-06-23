import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {Chart} from '../../chart.class';
import { formatLabel } from "@swimlane/ngx-charts";
import { nest } from 'd3-collection';
import * as d3 from 'd3';


const defaultOptions = {

};
@Component({
  selector: 'app-advanced-pie-chart',
  templateUrl: './advanced-pie-chart.component.html',
  styleUrls: ['./advanced-pie-chart.component.scss']
})
export class AdvancedPieChartComponent extends Chart implements OnInit, OnDestroy {
  
  data: Array<any> = [];
  chartOptions: any;
  private width: number;
  private height: number;
  private _setIntervalHandler: any;
  view: any;
  colorScheme = {
    name: 'pie',
    selectable: true,
    group: 'Ordinal',
    domain: [
        '#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886'
        ]
  };
  gradient = false;
  tooltipDisabled = false;

  // margin
  private margin: any = { top: 20, bottom: 20, left: 40, right: 40 };

  constructor() {
    super();
    }

   ngOnInit() {
    this.chartOptions = { ...this.configInput };
    this.init();
  }

  init() {
    if (this.configInput != null)
      this.data = AdvancedPieChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    else
        this.data = this.dataInput;
  }


  load() {
    this.data = [];
    this._setIntervalHandler =  setTimeout(() => this.data = this.dataInput[0].results);
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
        value: d.value,
      };
    }
  }
  ease() {
  }

  select(data) {
    console.log('Item clicked', data);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  pieTooltipText({data}) {
    const label = formatLabel(data.name);
    const val = formatLabel(data.value);

    return `
      <span class="tooltip-label">${label}</span>
      <span class="tooltip-val">$${val}</span>
    `;
  }

  ngOnDestroy() {
    clearTimeout(this._setIntervalHandler);
  }

}
