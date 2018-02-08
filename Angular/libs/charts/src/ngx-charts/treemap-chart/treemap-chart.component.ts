import { Component, OnInit, OnDestroy, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef , ViewChild} from '@angular/core';
import * as shape from 'd3-shape';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
import * as d3 from 'd3';

const defaultOptions = {
  view: [900, 600],
  colorScheme: colorSets.find(s => s.name === 'cool'),
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
  selector: 'app-treemap-chart',
  templateUrl: './treemap-chart.component.html',
  styleUrls: ['./treemap-chart.component.scss']
})
export class TreemapChartComponent extends Chart implements OnInit, OnDestroy {
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
    let svg = d3.select(element).select('svg')

     // Set the config
     setTimeout(()=>{
       svg.attr("width","100%")
       .attr("height","100%")
       .attr("viewBox", "0 0 "+ (element.offsetWidth) + " " + element.offsetHeight);
     }, 500);
   }
  /**
   * Process json Data to Ngx-charts format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
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

  setData(graphData, graphConfig) {
    this.chartOptions = { ...this.chartOptions, ...graphConfig };
    this.data = graphData;
  }

  init() {
    if (this.configInput != null)
      this.data = TreemapChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
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
    d3.select('#TreemapChartComponent').remove();
  }
}
