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
import { nest } from 'd3-collection';
import * as _ from 'lodash';
import { Chart } from '../chart.class';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends Chart implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;
  private data: Array<any> = [];
  private margin: any = {top: 20, right: 20, bottom: 20, left: 20};
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

  constructor() {
    super();
  }

  ngOnInit() {
    this.chartOptions = { ...this.configInput };
    d3.select('#BarChartComponent').remove();
    this.init();
  }

  ngOnChanges() {
    d3.select('#BarChartComponent').remove();
    this.init();
  }

  /**
   * Process json Data to D3.js Bar chart format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  public static convertData(dataDims: string[], rawData: any) {
    const name$ = d => d[_.head(dataDims[0])];
    const value$ = d => d[_.head(dataDims[1])];

    function sum(d: any) {
      return {
        name: name$(_.head(d)),
        index: name$(_.head(d)),
        value: _.reduce(d, (total, el) => total + value$(el), 0),
        x: name$(_.head(d)),
        y: _.reduce(d, (total, el) => total + value$(el), 0)
      };
    }

    return _.chain(rawData)
      .groupBy(_.head(dataDims[0]))
      .map(sum)
      .value();
  }

  setData(data) {
    if (data.length === 0) return;
    this.data = data;
  }

  init() {
    if (this.configInput != null) this.data = BarChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    else this.data = this.dataInput;
    if (this.data === undefined) this.data = [];

    this.drawChart();
  }

  /**
   * Draw function for D3.js Bar chart
   */
  drawChart() {
    setTimeout(()=>{

      const element = this.chartContainer.nativeElement;
      this.width = element.offsetWidth - this.margin.left - this.margin.right;
      this.height = element.offsetHeight - this.margin.top - this.margin.bottom;;

      const svg = d3
        .select(element)
        .append('svg')
        .attr('id', 'BarChartComponent')
        .attr('width', element.offsetWidth )
        .attr('height', element.offsetHeight);

      // chart plot area
      this.chart = svg
        .append('g')
        .attr('class', 'bars')
        .attr('transform', `translate(${this.margin.left }, ${this.margin.top})`);

      // define X & Y domains
      const xDomain = this.data.map(d => d.index);
      const yDomain = [0, d3.max(this.data, d => d.value)];

      // create scales
      this.xScale = d3
        .scaleBand()
        .padding(0.1)
        .domain(xDomain)
        .rangeRound([0, this.width]);
      this.yScale = d3
        .scaleLinear()
        .domain(yDomain)
        .range([this.height, 0]);

      // bar colors
      this.colors = d3.scaleOrdinal(d3.schemeCategory20);

      // x & y axis
      this.xAxis = svg
        .append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', `translate(${this.margin.left}, ${this.height  + this.margin.bottom})`)
        .call(d3.axisBottom(this.xScale));
      this.yAxis = svg
        .append('g')
        .attr('class', 'axis axis-y')
        .attr('transform', `translate(0, ${this.width})`)
        .call(d3.axisLeft(this.yScale));

      // update scales & axis
      this.xScale.domain(this.data.map(d => d.index));
      this.yScale.domain([0, d3.max(this.data, d => d.value)]);
      // this.colors.domain([0, this.data.length]);
      this.xAxis.transition().call(d3.axisBottom(this.xScale));
      this.yAxis.transition().call(d3.axisLeft(this.yScale));

      const bars = this.chart.selectAll('.bar');

      bars
        .transition()
        .attr('x', d => this.xScale(d.index))
        .attr('y', d => this.yScale(d.value))
        .attr('width', d => this.xScale.bandwidth())
        .attr('height', d => this.height - this.yScale(d.value))
        .style('fill', (d, i) => this.colors(i));

      bars
        .data(this.data)
        .enter()
        .append('g')
        .attr('class', 'bar-block')
        .on('mouseover', _ => {
          d3.select(d3.event.srcElement).attr('opacity', 1);
          d3.select(d3.event.target.nextElementSibling).attr('font-size', '24px');
        })
        .on('mouseout', _ => {
          d3.select(d3.event.srcElement).attr('opacity', 0.8);
          d3.select(d3.event.target.nextElementSibling).attr('font-size', '14px');
        });

      this.chart
        .selectAll('.bar-block')
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => this.xScale(d.index))
        .attr('y', d => this.yScale(0))
        .attr('width', this.xScale.bandwidth())
        .attr('height', 0)
        .attr('opacity', 0.8)
        .style('fill', (d, i) => this.colors(i));

      this.chart
        .selectAll('.bar-block')
        .append('text')
        .attr('class', 'value-text')
        .attr('font-weight', 600)
        .attr('x', d => this.xScale(d.index) + this.xScale.bandwidth() / 2)
        .attr('y', d => this.yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', (d, i) => this.colors(i))
        .attr('opacity', 1)
        .text(d => d.value);

      this.chart
        .selectAll('.bar')
        .transition()
        // .delay((d, i) => i * 100 + 400)
        .attr('y', d => this.yScale(d.value))
        .attr('height', d => this.height - this.yScale(d.value));
      },500)
  }

  load() {
    this.loaded = true;
    this.chart
      .selectAll('.bar')
      .attr('y', d => this.yScale(0))
      .attr('height', d => this.height - this.yScale(0));

    this.chart.selectAll('.value-text').attr('opacity', 0);

    this.chart
      .selectAll('.bar')
      .transition()
      .duration(1500)
      .attr('y', d => this.yScale(d.value))
      .attr('height', d => this.height - this.yScale(d.value));
    this.chart
      .selectAll('.value-text')
      .transition()
      .delay(1300)
      .duration(200)
      .attr('opacity', 1);
  }

  // FIXME
  ease() {
    this.loaded = false;
    this.chart
      .selectAll('.bar')
      .transition()
      .delay((d, i) => i * 100)
      .attr('y', d => this.yScale(0))
      .attr('height', d => this.height - this.yScale(0));
    this.chart
      .selectAll('.value-text')
      .transition()
      .duration(200)
      .attr('opacity', 0);
    const waitingTime = this.chart.selectAll('.bar')._groups[0].length * 100;
  }
}
