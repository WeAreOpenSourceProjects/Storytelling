import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, ViewChild, ElementRef } from '@angular/core';
import * as shape from 'd3-shape';
import * as d3 from 'd3';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
const defaultOptions = {
  view: [1200, 800],
  showXAxis: true,
  showYAxis: true,
  gradient: false,
  showLegend: true,
  showXAxisLabel: true,
  showYAxisLabel: true,
  colorScheme: {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  },
  autoScale: true
};
@Component({
  selector: 'app-pie-grid-chart',
  templateUrl: './pie-grid-chart.component.html',
  styleUrls: ['./pie-grid-chart.component.scss']
})
export class PieGridChartComponent extends Chart implements OnInit, OnDestroy, OnChanges {
  chartOptions: any;
  @ViewChild('chart') private chartContainer: ElementRef;

  data: any[];
  private activated: boolean = true;
  private _setIntervalHandler: any;

  constructor() {
    super();
  }

  ngOnInit() {
    // Set the config
    this.chartOptions = { ...defaultOptions, ...this.configInput };

  }
  ngAfterViewInit(){
    let element = this.chartContainer.nativeElement;
    setTimeout(()=>{
      let svg = d3.select(element).select('svg')
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", "0 0 "+ (element.offsetWidth) + " " + element.offsetHeight)
    },500)
    this.init();

  }
  /**
   * Process json Data to Ngx-charts format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  public static convertData(dataDims: string[], rawData: any) {
    if (dataDims === undefined || rawData === undefined) return null;
    const key$ = d => d[dataDims[0]];
    return nest()
      .key(key$)
      .entries(rawData)
      .map(values);

    function values(d) {
      return {
        name: d.key,
        value: d.values
          .map(val => {
            return val[dataDims[1]];
          })
          .reduce((ele1, ele2) => {
            return ele1 + ele2;
          }, 0)
      };
    }
  }

  setData(graphData, graphConfig) {
    this.chartOptions = { ...this.chartOptions, ...graphConfig };
    this.data = graphData;
  }
  ngOnChanges() {
    d3.select('#PieGridChartComponent').remove();
    this.init();
  }
  init() {
    if (this.configInput != null)
      this.data = PieGridChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
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
