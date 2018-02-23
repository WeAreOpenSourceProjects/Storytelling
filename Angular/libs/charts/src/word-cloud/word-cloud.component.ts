import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  ViewEncapsulation,
  AfterViewInit
} from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as _ from 'lodash';
import { Chart } from '../chart.class';

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent extends Chart implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  private data: Array<any> = [];
  private margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private loaded = true;
  private chartOptions: any;
  private max: any;

  constructor() {
    super();
  }

  ngOnInit() {
    this.chartOptions = { ...this.configInput };
    this.init();
  }

  /**
   * Process json Data to d3.js Bar chart format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  // tslint:disable-next-line:member-ordering
  public static convertData(dataDims: string[], rawData: any) {
    const name$ = d => d[_.head(dataDims[0])];
    const value$ = d => d[_.head(dataDims[1])];

    function sum(d: any) {
      return {
        name: name$(_.head(d)),
        value: _.reduce(d, (total, el) => total + value$(el), 0)
      };
    }

    const data = _.chain(rawData)
      .groupBy(_.head(dataDims[0]))
      .map(sum)
      .value();

    const max = _.maxBy(data, 'value');
    const totalV = _.reduce(data, (total, el) => total + el.value, 0);

    return _.chain(data)
      .map((d: any) => {
        return { name: d.name, value: Math.trunc(d.value / totalV * 100) };
      })
      .value();
  }

  setData(data) {
    if (data.length === 0) {
      return;
    }
    this.data = data;
  }

  init() {
    if (this.configInput != null) {
      this.data = WordCloudComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    } else {
      this.data = this.dataInput;
    }
    this.drawChart();
  }

  /**
   * Draw function for d3.js Bar chart
   */
  drawChart() {
    if (this.data === undefined) return;
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const size = [_.min([50 * this.data.length, this.width]), _.min([50 * this.data.length, this.height])];

    const fill = d3.scaleOrdinal(d3.schemeCategory20);

    const xScale = d3Scale
      .scaleSqrt()
      .domain([0, 100])
      .range([10, 100]);

    // Construct the word cloud's SVG element
    const svg = d3
      .select(element)
      .append('svg')
      .attr('id', 'WordCloudComponent')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${element.offsetWidth >> 1}, ${element.offsetHeight >> 1})`);

    const cloud = svg.selectAll('g text').data(this.data, function(d: any) {
      return d.name;
    });

    // Entering words
    cloud
      .enter()
      .append('text')
      .style('font-family', 'Impact')
      .style('fill', function(d: any, i: any) {
        return fill(i);
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', 1)
      .text(function(d) {
        return d.name;
      });

    d3.layout
      .cloud()
      .size([this.width, this.height])
      .timeInterval(20)
      .words(this.data)
      .padding(5)
      .rotate(function() {
        return ~~(Math.random() * 2) * 90;
      })
      .font('Impact')
      .spiral('archimedean')
      .fontSize(function(d) {
        return xScale(+d.value);
      })
      .text(function(d) {
        return d.name;
      })
      .on('end', w => {
        this.draw(svg, xScale, w);
      })
      .start();
  }

  // Draw the word cloud
  draw(svg, xScale, words) {
    const clouds = svg.selectAll('g text').data(words, function(d: any) {
      return d.name;
    });

    // Entering and existing words
    clouds
      .transition()
      .duration(600)
      .style('font-size', function(d) {
        return xScale(+d.value) + 'px';
      })
      .attr('transform', function(d) {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
      })
      .style('fill-opacity', 1);
  }
}
