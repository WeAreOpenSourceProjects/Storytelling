import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import * as shape from 'd3-shape';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
import * as _ from 'lodash';
import * as d3 from 'd3';

const defaultOptions = {
  view: [2000, 2000],
  colorScheme: colorSets.find(s => {
    if (s === undefined) return;
    else return s.name === 'cool';
  }),
  schemeType: 'ordinal',
  showLegend: true,
  legendTitle: 'Legend',
  gradient: false,
  showXAxis: true,
  showYAxis: true,
  showXAxisLabel: true,
  showYAxisLabel: true,
  yAxisLabel: '',
  xAxisLabel: '',
  autoScale: true,
  showGridLines: true,
  rangeFillOpacity: 0.5,
  roundDomains: false,
  tooltipDisabled: false,
  showSeriesOnHover: true,
  curve: shape.curveLinear,
  curveClosed: shape.curveCardinalClosed
};

@Component({
  selector: 'app-ng-graph',
  templateUrl: './ng-graph.component.html',
  styleUrls: ['./ng-graph.component.scss']
})
export class NgGraphComponent extends Chart implements OnInit, OnDestroy {
  chartOptions: any;
  @ViewChild('chart') private chartContainer: ElementRef;

  data: any[];
  private activated: boolean = true;
  private _setIntervalHandler: any;

  constructor() {
    super();
  }
  ngOnInit(){
    this.chartOptions = { ...defaultOptions, ...this.configInput };
    this.init()

  }
  ngAfterViewInit(){
    let element = this.chartContainer.nativeElement;
    console.log(element, this.chartContainer)
    console.log('d3',d3.select('svg'))

     // Set the config
     setTimeout(()=>{
       d3.select(element).select('svg')
         .attr("width","100%")
         .attr("height","100%")
         .attr("viewBox", "0 0 "+ (element.offsetWidth) + " " + element.offsetHeight);
     })
   }
  /**
   * Process json Data to Ngx-charts format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  public static convertData(dataDims: string[][], rawData: any) {
    if (dataDims === undefined || rawData === undefined) return;
    const key$ = d => d[_.head(dataDims[0])];
    const name$ = d => d[_.head(dataDims[1])];
    const value$ = d => d[_.head(dataDims[2])];
    const value2$ = d => d[_.head(dataDims[3])];

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
        value: value$(d),
        x: name$(d),
        y: value$(d),
        r: value2$(d)
      };
    }
  }
  setData(graphData, graphConfig) {
    this.chartOptions = { ...this.chartOptions, ...graphConfig };
    this.data = graphData;
  }

  init() {
    if (this.configInput != null)
      this.data = NgGraphComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    else this.data = this.dataInput;
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
