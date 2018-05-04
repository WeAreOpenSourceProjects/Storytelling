import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
import * as d3 from 'd3';
@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent extends Chart implements OnInit {
  data: Array<any> = [];
  @ViewChild('chart') private chartContainer: ElementRef;

  private width: number;
  private height: number;
  chartOptions: any;
  view: null;
  showLegend: boolean = true;
  legendTitle: string = 'Legend';
  gaugeTextValue: string = '';
  colorScheme: any;
  gaugeMin: number = 0;
  gaugeMax: number = 100;
  gaugeUnits: string;
  gaugeAngleSpan: number = 240;
  gaugeStartAngle: number = -120;
  gaugeShowAxis: boolean = true;
  gaugeLargeSegments: number = 10;
  gaugeSmallSegments: number = 5;
  autoScale = true;

  // margin
  margin: boolean = false;
  marginTop: number = 40;
  marginRight: number = 40;
  marginBottom: number = 40;
  marginLeft: number = 40;

  tooltipDisabled = false;

  constructor() {
    super();
  }

  ngOnInit() {
    this.colorScheme = {
      name: 'gauge',
      selectable: true,
      group: 'Ordinal',
      domain: ['#3498db', '#74b9ff', '#f39c12', '#fed330', '#27ae60', '#a3cb38', '#ee5a24', '#fa8231',
      '#8e44ad', '#9c88ff', '#079992', '#7bc8a4', '#b71540', '#eb4d4b', '#34495e', '#487eb0', '#7f8c8d', '#bdc3c7']
    };

    // Set data
    this.chartOptions = { ...this.configInput };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let element = this.chartContainer.nativeElement;
      let svg = d3.select(element).select('svg');
      svg.attr('viewBox', '0 0 ' + element.offsetWidth + ' ' + element.offsetHeight);
      this.init();
    });
  }

  init() {
    if (this.configInput != null)
      this.data = GaugeChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
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

  ease() {}

  select(data) {
    console.log('Item clicked', data);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }
}
