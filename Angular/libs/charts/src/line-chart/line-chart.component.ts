import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { nest } from 'd3-collection';
import { Chart } from '../chart.class';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent extends Chart {
  @ViewChild('chart') private chartContainer: ElementRef;
  private data: Array<any> = [];
  private width: number;
  private height: number;
  private heightTB: number; //height of thumbnail
  private curtain: any; //for animation
  /*
    this line chart is more compatible for continous data like timeline,but also can be uesd for uncontinous data like number or string. the format for time: "Jan 09"
    */
  private dateMode: boolean; //date data in xAxis
  private tb;
  private paths;
  private dots;
  private chartOptions: any;
  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.chartOptions = { ...this.configInput };
    d3.select('#LineChartComponent').remove();
    if (this.data === undefined) return;
    setTimeout(() => {
      this.init();
    }, 500);
  }

  brushed(x, xTB, xAxis, svg, area, focus, zoom) {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
    var s = d3.event.selection || xTB.range();
    if (this.dateMode) x.domain(s.map(xTB.invert, xTB));
    else {
      let x1 = 0 - this.width * s[0] / (s[1] - s[0]);
      x.range([x1, this.width * (this.width - s[0]) / (s[1] - s[0])]);
    }
    focus.select('.area').attr('d', area);
    focus.select('.axis--x').call(xAxis);

    if (this.dateMode)
      svg.select('.zoom').call(zoom.transform, d3.zoomIdentity.scale(this.width / (s[1] - s[0])).translate(-s[0], 0));
  }
  zoomed(x, xTB, area, xAxis, brush, focus, context) {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
    var t = d3.event.transform;
    if (this.dateMode) x.domain(t.rescaleX(xTB).domain());
    else x.range([t.x, this.width * t.k]);
    focus.select('.area').attr('d', area);
    focus.select('.axis--x').call(xAxis);

    if (this.dateMode) context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
  }
  setData(data: any) {
    if (data === undefined) return;
    let parseDate = d3.timeParse('%b %Y');

    this.data = data;

    if (parseDate(this.data[0][0].xAxis) != null) this.dateMode = true;
    this.data.forEach(d => {
      d.forEach(d => {
        if (this.dateMode) {
          d['xAxis'] = parseDate(d['xAxis']);
        }
        d['yAxis'] = parseFloat(d['yAxis']);
      });
    });
  }
  /**
   * Process json Data to D3.js Bar chart format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  public static convertData(dataDims: string[], rawData: any) {
    const series$ = d => d[_.head(dataDims[0])];
    const xaxis$ = d => d[_.head(dataDims[1])];
    const yaxis$ = d => d[_.head(dataDims[2])];
    let result1 = _.chain(rawData)
      .groupBy(_.head(dataDims[0]))
      .map(series)
      .value();

    let result = _.chain(result1)
      .map(mapSeries)
      .value();
    function series(d: any) {
      let result = _.map(d, d => {
        return {
          series: series$(d),
          xAxis: xaxis$(d),
          yAxis: yaxis$(d)
        };
      });
      return result;
    }
    function mapSeries(d: any) {
      let result1 = _.groupBy(d, d => {
        return d['xAxis'];
      });

      let result = _.map(result1, d => {
        return _.reduce(d, (total, d) => {
          return {
            series: total['series'],
            xAxis: total['xAxis'],
            yAxis: total['yAxis'] + d['yAxis']
          };
        });
      });
      return result;
    }
    return result;
  }
  init() {
    this.data = [];
    if (this.configInput != null)
      this.data = LineChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    else this.data = this.dataInput;
    this.dateMode = false;
    this.heightTB = 60; //set height of thumbnail
    this.setData(this.data);
    if (this.data === undefined) return;
    this.drawChart();
    this.load();
  }
  drawChart() {
    let element = this.chartContainer.nativeElement;
    let margin = { top: 0, right: 50, bottom: 0, left: 50 };
    this.width = element.offsetWidth - margin.left - margin.right;
    this.height = element.offsetHeight - margin.top - margin.bottom - this.heightTB - 60;

    // Define the div for the tooltip
    var div = d3
      .select(element)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    let svg = d3
      .select(element)
      .append('svg')
      .attr('id', 'LineChartComponent')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + element.offsetWidth + ' ' + element.offsetHeight);

    //.attr('transform', 'translate(' + 0 + ',' + this.height / 2 + ')');
    let value = [];
    this.data.forEach(d => {
      value = value.concat(d);
    });

    // define X & Y domains
    let xDomain;
    if (this.dateMode) xDomain = [d3.min(value, d => d['xAxis']), d3.max(value, d => d['xAxis'])];
    else xDomain = value.map(d => d['xAxis']);
    let yDomain = [0, d3.max(value, d => d['yAxis'])];

    /*zoom */
    let zoomScale = 1;
    let zoom = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', _ => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
        var t = d3.event.transform;
        focus.selectAll('.line').attr('d', line);
        focus.selectAll('.xAxis').call(xAxis);
        this.tb.select('.brush').call(brush.move, xTB.range().map(t.invertX, t));
        svg
          .selectAll('.dot')
          .attr('cx', d => x(d['xAxis']))
          .attr('cy', d => y(d['yAxis']));
        if (this.dateMode) x.domain(t.rescaleX(xTB).domain());
        else x.range([t.x, this.width * t.k]);
        //t.k is the scale
        zoomScale = t.k;

        if (t.k > 3) {
          svg
            .selectAll('.dot')
            .transition()
            .duration(500)
            .attr('opacity', 1);
        } else {
          svg
            .selectAll('.dot')
            .transition()
            .duration(100)
            .attr('opacity', 0);
        }
      });
    svg
      .append('rect')
      .attr('class', 'zoom')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);
    /*chart area*/
    let focus = svg
      .append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let x;
    if (this.dateMode) {
      x = d3
        .scaleTime()
        .domain(xDomain)
        .rangeRound([0, this.width]);
    } else {
      x = d3
        .scalePoint()
        .padding(0.1)
        .domain(xDomain)
        .rangeRound([0, this.width]);
    }
    let y = d3
      .scaleLinear()
      .domain(yDomain)
      .range([this.height, 0]);

    let line = d3
      .line()
      .x(d => x(d['xAxis']))
      .y(d => y(d['yAxis']));

    //create axis for line chart
    let xAxis = d3.axisBottom(x);
    focus
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .attr('class', 'axis xAxis')
      .call(xAxis);
    focus
      .append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y))
      .append('text')

      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('yAxis');

    //draw line for line chart
    let colors: any = d3.scaleOrdinal(d3.schemeCategory20);
    let pathContainer = focus
      .append('svg')
      .attr('class', 'pathContainer')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.paths = pathContainer
      .selectAll('.line')
      .data(this.data)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => colors(i))
      .attr('d', d => line(d));

    //*thumbnail*//
    let marginTopTB = margin.top + this.height + 40;
    this.tb = svg
      .append('g')
      .attr('class', 'thumbnail')
      .attr('transform', 'translate(' + margin.left + ',' + marginTopTB + ')');

    let xTB;
    if (this.dateMode) {
      xTB = d3
        .scaleTime()
        .domain(xDomain)
        .rangeRound([0, this.width]);
    } else {
      xTB = d3
        .scalePoint()
        .padding(0.1)
        .domain(xDomain)
        .rangeRound([0, this.width]);
    }
    let yTB = d3
      .scaleLinear()
      .domain(yDomain)
      .range([this.heightTB, 0]);

    let lineTB = d3
      .line()
      .x(d => xTB(d['xAxis']))
      .y(d => yTB(d['yAxis']));

    //creat axis for thumbnail
    let xAxisTB = d3.axisBottom(xTB);
    this.tb
      .append('g')
      .attr('transform', 'translate(0,' + this.heightTB + ')')
      .attr('class', 'axis')
      .call(xAxisTB);

    //draw line for thumbnail
    let linesTB = this.tb
      .selectAll('.line')
      .data(this.data)
      .enter()
      .append('path')
      .attr('class', 'lineTB')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => colors(i))
      .attr('d', d => lineTB(d));

    let brush = d3
      .brushX()
      .extent([[0, 0], [this.width, this.heightTB]])
      .on('brush end', _ => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
        svg
          .selectAll('.dot')
          .transition()
          .duration(0)
          .attr('opacity', 0);
        var s = d3.event.selection || xTB.range();

        if (this.dateMode) x.domain(s.map(xTB.invert, xTB));
        else {
          let x1 = 0 - this.width * s[0] / (s[1] - s[0]);
          x.range([x1, this.width * (this.width - s[0]) / (s[1] - s[0])]);
        }
        focus.selectAll('.line').attr('d', line);
        focus.selectAll('.xAxis').call(xAxis);
        svg
          .selectAll('.dot')
          .attr('cx', d => x(d['xAxis']))
          .attr('cy', d => y(d['yAxis']));
        if (this.dateMode)
          svg
            .select('.zoom')
            .call(zoom.transform, d3.zoomIdentity.scale(this.width / (s[1] - s[0])).translate(-s[0], 0));
        else {
          svg
            .select('.zoom')
            .call(zoom.transform, d3.zoomIdentity.scale(this.width / (s[1] - s[0])).translate(-s[0], 0));
        }
      });

    /*brush*/
    this.tb
      .append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range());

    // Add the scatterplot
    let dotContainer = focus
      .append('svg')
      .attr('class', 'dotContainer')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', 'translate(1500,0)');
    for (let i = 0; i < this.data.length; i++) {
      let dots = dotContainer.append('g').attr('class', 'dots dots' + i);
      this.dots = dots
        .selectAll('.dot')
        .data(this.data[i])
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('opacity', 0)
        .attr('r', 7)
        .attr('fill', colors(i))
        .attr('cx', d => x(d['xAxis']))
        .attr('cy', d => y(d['yAxis']))
        .on('mouseover', function(d) {
          let curR = parseInt(d3.select(d3.event.srcElement).attr('r'));
          d3
            .select(d3.event.srcElement)
            .transition()
            .duration(200)
            .attr('r', _ => (zoomScale > 3 ? 20 : 7))
            .attr('opacity', 1);
          div
            .transition()
            .duration(200)
            .style('opacity', 0.9);

          div
            .html('<p>' + d['series'] + '<br/>' + d['xAxis'] + '<br/>' + d['yAxis'] + '</p>')
            .style('left', d3.event.layerX + 'px')
            .style('top', d3.event.layerY + 25 + 'px');
        })
        .on('mouseout', function(d) {
          let curR = parseInt(d3.select(d3.event.srcElement).attr('r'));
          div
            .transition()
            .duration(500)
            .style('opacity', 0);
          d3
            .select(d3.event.srcElement)
            .transition()
            .duration(200)
            .attr('r', 7)
            .attr('opacity', _ => (zoomScale > 3 ? 1 : 0));
        });
    }
    /* Add 'curtain' rectangle to hide entire graph */
    this.curtain = svg
      .append('rect')
      .attr('x', -1 * this.width)
      .attr('y', -1 * this.height)
      .attr('height', this.height)
      .attr('width', 0)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180) translate(' + (0 - margin.left) + ',' + margin.top + ')')
      .style('fill', '#f2f2f2');
  }

  load() {
    this.curtain.attr('width', this.width);
    this.tb.attr('opacity', 0);
    this.curtain
      .transition()
      .duration(2000)
      .attr('width', 0);
    this.tb
      .transition()
      .delay(800)
      .duration(1000)
      .attr('opacity', 1);
  }

  ease() {
    this.curtain
      .transition()
      .duration(800)
      .attr('width', this.width);
    this.tb
      .transition()
      .duration(1000)
      .attr('opacity', 0);
    this.curtain
      .transition()
      .delay(1250)
      .attr('width', 0);
    this.tb
      .transition()
      .delay(1250)
      .attr('opacity', 1);
  }
}
