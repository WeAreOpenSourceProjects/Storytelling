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
import { HierarchyNode } from 'd3';
import { nest } from 'd3-collection';
import * as _ from 'lodash';

import { Chart } from '../chart.class';

@Component({
  selector: 'app-zoomable-treemap-chart',
  templateUrl: './zoomable-treemap-chart.component.html',
  styleUrls: ['./zoomable-treemap-chart.component.scss']
})
export class ZoomableTreemapChartComponent extends Chart {
  @ViewChild('chart') private chartContainer: ElementRef;
  private data: any;
  private curtain: any; //for animation
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private root: any;
  private node: any;

  private chartOptions: any;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.chartOptions = { ...this.configInput };
    d3.select('#ZoomableTreemapComponent').remove();
    setTimeout(() => {
      this.init();
    }, 500);
  }

  /**
   * Process json Data to Ngx-charts format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  public static convertData(dataDims: string[], rawData: any) {
    const hierarchy$ = depth => d => d[dataDims[0][depth]];
    const value$ = d => d[dataDims[1]];
    const depthDim = dataDims[0].length;

    const root = { name: _.head(dataDims[0]), children: [] };

    const level0 = _.chain(rawData)
      .groupBy(_.head(dataDims[0]))
      .flatMap(d => sum(d, 0, hierarchy$(0)))
      .value();

    function sum(d, depth, fetchId$) {
      let level = {
        name: fetchId$(d[0])
      };

      let upperLevel;

      depth += 1;
      if (depth < depthDim) {
        upperLevel = Object.assign({}, level, { children: [] });

        upperLevel.children = _.chain(d)
          .groupBy(dataDims[0][depth])
          .flatMap(d1 => sum(d1, depth, hierarchy$(depth)))
          .value();
      }

      if (upperLevel) {
        level = upperLevel;
      } else {
        level = Object.assign(level, { value: _.reduce(d, (total, el) => total + value$(el), 0) });
      }

      return level;
    }

    root.children = root.children.concat(level0);
    return root;
  }

  init() {
    if (this.configInput != null) {
      this.data = ZoomableTreemapChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    } else {
      this.data = this.dataInput;
    }
    this.drawChart();
    this.load();
  }

  /**
   * Draw function for D3.js Bar chart
   */
  drawChart() {
    if (this.data === undefined) return;
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    // x and y definition
    this.xScale = d3.scaleLinear().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([0, this.height]);

    // Color definition
    let colorDomain = [
      '#FF8A8A',
      '#C58AFF',
      '#FF8AC5',
      '#FFC875',
      '#F8FF86',
      '#86FF6a',
      '#7DF5FF',
      '#8AFFC5',
      '#BED2ED'
    ];
    let color = d3.scaleOrdinal(colorDomain);

    let format = d3.format(',d');

    // Chart construction
    this.chart = d3
      .select(element)
      .append('svg')
      .attr('id', 'ZoomableTreemapComponent')
      .attr('class', 'svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    let treemap = d3
      .treemap()
      .tile(d3.treemapResquarify)
      .size([this.width, this.height])
      .round(true);

    this.root = d3
      .hierarchy(this.data)
      .eachBefore((d: any) => {
        d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
      })
      .sum((d: any) => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    this.node = this.root;

    treemap(this.root);

    let cell = this.chart
      .selectAll('g')
      .data(this.root.leaves())
      .enter()
      .append('g')
      .attr('class', 'cell')
      .attr('transform', function(d) {
        return 'translate(' + d['x0'] + ',' + d['y0'] + ')';
      })
      .on('click', d => this.zoom(this.node == d.parent ? this.root : d.parent, this.xScale, this.yScale));

    cell
      .append('rect')
      .attr('id', d => d.data.id)
      .attr('width', d => d['x1'] - d['x0'] - 1)
      .attr('height', d => d['y1'] - d['y0'] - 1)
      .attr('fill', d => color(d.parent.data.id));

    cell
      .append('text')
      .attr('x', d => (d['x1'] - d['x0']) / 2)
      .attr('y', d => (d['y1'] - d['y0']) / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.id)
      .style('opacity', function(d) {
        let stringLength = (<SVGTSpanElement>this).getComputedTextLength();
        return d['x1'] - d['x0'] > stringLength ? 1 : 0;
      });

    /* Add 'curtain' rectangle to hide entire graph */
    this.curtain = this.chart.style('opacity', 0);

    cell.append('title').text(d => d.data.id + '\n' + format(d.value));

    // When we click outside the graph, we reinit it
    d3.select(window).on('click', () => this.zoom(this.root, this.xScale, this.yScale));
  }

  private zoom(d, x, y) {
    // Ratio
    let kx = this.width / (d['x1'] - d['x0']);
    let ky = this.height / (d['y1'] - d['y0']);

    // New x and y domains
    x.domain([d['x0'], d['x1']]);
    y.domain([d['y0'], d['y1']]);

    // Cells translation
    let t = this.chart
      .selectAll('g.cell')
      .transition()
      .duration(750)
      .attr('transform', function(d) {
        return 'translate(' + x(d['x0']) + ',' + y(d['y0']) + ')';
      });

    // Rect new dimensions
    t
      .select('rect')
      .attr('width', function(d) {
        return kx * (d['x1'] - d['x0']) - 1;
      })
      .attr('height', function(d) {
        return ky * (d['y1'] - d['y0']) - 1;
      });

    // Text position
    t
      .select('text')
      .attr('x', function(d) {
        return kx * (d['x1'] - d['x0']) / 2;
      })
      .attr('y', function(d) {
        return ky * (d['y1'] - d['y0']) / 2;
      })
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('opacity', function(d) {
        let stringLength = (<SVGTSpanElement>this).getComputedTextLength();
        return kx * (d['x1'] - d['x0']) > stringLength ? 1 : 0;
      });

    this.node = d;
    d3.event.stopPropagation();
  }

  load() {
    if (this.curtain === undefined) return;
    this.curtain
      .transition()
      .duration(2000)
      .style('opacity', 1);
  }

  ease() {
    if (this.curtain === undefined) return;
    this.curtain
      .transition()
      .duration(1000)
      .style('opacity', 0);
  }
}
