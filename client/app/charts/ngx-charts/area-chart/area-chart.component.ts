import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import * as shape from 'd3-shape';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
import * as d3 from 'd3';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss']
})
export class AreaChartComponent extends Chart implements OnInit, OnChanges, OnDestroy {
  view: any;
  chartOptions: any;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  autoScale = true;

  data: any[];
  private _setIntervalHandler: any;
  colorScheme : any;
  constructor() { super() }

  ngOnInit() {
    // Set the config
    this.colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']}
    this.chartOptions = { ...this.configInput };
    this.init();

  }
  ngOnChanges(){
    d3.select("#AreaChartComponent").remove();
    this.init();
  }
  /**
   * Process json Data to Ngx-charts format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  public static convertData(dataDims: string[], rawData: any) {

    const key$ = d => d[dataDims[0]];
    const name$ = d => d[dataDims[1]];
    const value$ = d => d[dataDims[2]];

    return nest()
        .key(key$)
        .entries(rawData)
        .map(series);

    function series(d) {
      return {
        name: d.key,
        series: d.values.map(seriesPoints)
      };
    }

    function seriesPoints(d) {
      return {
        name: name$(d),
        value: value$(d)
      };
    }
  }

  setData(graphData, graphConfig) {
    this.chartOptions = { ...this.chartOptions, ...graphConfig };
    this.data = graphData;
  }

  init() {
    if (this.configInput != null)
      this.data = AreaChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    else
      this.data = this.dataInput;
  }

  load() {
    // this.data = [];
    // this._setIntervalHandler =  setTimeout(() => this.data = this.dataInput);
  }

  ease() {
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
