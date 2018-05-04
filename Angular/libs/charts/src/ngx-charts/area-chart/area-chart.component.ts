import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
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
export class AreaChartComponent extends Chart implements OnInit, OnDestroy {
  @ViewChild('chart') private chartContainer: ElementRef;

  view: null;
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
  colorScheme: any;
  constructor() {
    super();
  }

  ngOnInit() {
    // Set the config
    this.colorScheme = {
      domain: ['#3498db', '#74b9ff', '#f39c12', '#fed330', '#27ae60', '#a3cb38', '#ee5a24', '#fa8231',
      '#8e44ad', '#9c88ff', '#079992', '#7bc8a4', '#b71540', '#eb4d4b', '#34495e', '#487eb0', '#7f8c8d', '#bdc3c7']
    };
    this.chartOptions = { ...this.configInput };
    this.init();
  }
  ngAfterViewInit() {
    let element = this.chartContainer.nativeElement;
    let svg = d3.select(element).select('svg');

    // Set the config
    setTimeout(() => {
      svg
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 ' + element.offsetWidth + ' ' + element.offsetHeight);
    }, 500);
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
    else this.data = this.dataInput;
  }

  load() {
    // this.data = [];
    // this._setIntervalHandler =  setTimeout(() => this.data = this.dataInput);
  }

  ease() {}

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
