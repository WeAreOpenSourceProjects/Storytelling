import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import * as shape from 'd3-shape';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
import * as d3 from 'd3';
const defaultOptions = {
  view: null,
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
  selector: 'app-number-card',
  templateUrl: './number-card.component.html',
  styleUrls: ['./number-card.component.scss']
})
export class NumberCardComponent extends Chart implements OnDestroy {
  chartOptions: any;
  @ViewChild('chart') private chartContainer: ElementRef;

  data: any[];
  private activated: boolean = false;
  private _setIntervalHandler: any;

  constructor() {
    super();
  }
  ngOnInit() {
    this.chartOptions = { ...defaultOptions, ...this.configInput };
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
      this.init();
      this.activated = true;
    }, 500);
  }
  /**
   * Process json Data to Ngx-charts format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  public static convertData(dataDims: string[], rawData: any) {
    if (dataDims === undefined || rawData === undefined) return null;
    const key$ = d => d[dataDims[0]];
    const value$ = d => d[dataDims[1]];
    let result = nest()
      .key(key$)
      //  .key(name$)
      .rollup((v): any => {
        return d3.sum(v, d => d[dataDims[1]]);
      })
      .entries(rawData)
      .map(series);

    return result;
    function series(d) {
      return {
        name: d.key,
        value: d.value
      };
    }
  }

  setData(graphData, graphConfig) {
    this.chartOptions = { ...this.chartOptions, ...graphConfig };
    this.data = graphData;
  }

  init() {
    if (this.configInput != null)
      this.data = NumberCardComponent.convertData(this.chartOptions.dataDims, this.dataInput);
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
