import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { nest } from 'd3-collection';
import { legendColor } from 'd3-svg-legend';
import * as _ from 'lodash';
import { Chart } from '../chart.class';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent extends Chart implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;
  private element: any;
  private data: Array<any> = [];
  private width: number;
  private height: number;
  private radius: number;
  private _current: any; // for animation
  private bubbleColor = d3.scaleOrdinal(d3.schemeCategory20);
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private id;
  private curtain: any;
  private chartOptions: any;

  constructor() {
    super();
  }

  ngOnInit() {
    this.chartOptions = { ...this.configInput };
    d3.select('#BubbleChartComponent').remove();
    this.init();
  }

  ngOnChanges() {
    d3.select('#BubbleChartComponent').remove();
    this.init();
  }

  init() {
    if (this.configInput != null)
      this.data = BubbleChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    else this.data = this.dataInput;

    this.drawChart();
  }

  /**
   * Draw function for D3.js Bar chart
   */
  drawChart() {
    let element = this.chartContainer.nativeElement;
    let width = element.offsetWidth;
    let height = element.offsetHeight ;

    let svg = d3
      .select(element)
      .append('svg')
      .attr('id', 'BubbleChartComponent')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    let centerX = width * 0.5;
    let centerY = height * 0.5;
    let strength = 0.05;
    let focusedNode;

    let format = d3.format(',d');

    let scaleColor = d3.scaleOrdinal(d3.schemeCategory20);

    // use pack to calculate radius of the circle
    let pack = d3
      .pack()
      .size([width, height])
      .padding(1.5);

    let forceCollide = d3.forceCollide((d: any) => d.r + 1);

    // use the force
    let simulation = d3
      .forceSimulation()
      // .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('collide', forceCollide)
      //.force('center', d3.forceCenter(centerX, centerY))
      .force('x', d3.forceX(centerX).strength(strength))
      .force('y', d3.forceY(centerY).strength(strength));

    // reduce number of circles on mobile screen due to slow computation
    if ('matchMedia' in window && window.matchMedia('(max-device-width: 767px)').matches) {
      this.data = this.data.filter(el => {
        return el.value >= 50;
      });
    }

    let root = d3
      .hierarchy({
        children: this.data
      })
      .sum((d: any) => d.value);

    // we use pack() to automatically calculate radius conveniently only
    // and get only the leaves
    let nodes = pack(root)
      .leaves()
      .map(node => {
        const data: any = node.data;
        return {
          x: centerX + (node.x - centerX) * 3, // magnify start position to have transition to center movement
          y: centerY + (node.y - centerY) * 3,
          r: 0, // for tweening
          radius: node.r, //original radius
          id: data.cat + '.' + (data.name ? data.name.replace(/\s/g, '-') : ''),
          cat: data.cat,
          name: data.name,
          value: data.value,
          // icon: data.icon,
          desc: data.desc
        };
      });
    simulation.nodes(nodes).on('tick', ticked);

    let node = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(
        d3
          .drag<SVGCircleElement, INode>()
          .on('start', d => {
            if (!d3.event.active) {
              simulation.alphaTarget(0.2).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', d => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on('end', d => {
            if (!d3.event.active) {
              simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append('circle')
      .attr('id', d => d.id)
      .attr('r', 0)
      .style('fill', d => scaleColor(d.cat))
      .transition()
      .duration(2000)
      .ease(d3.easeElasticOut)
      .tween('circleIn', d => {
        let i = d3.interpolateNumber(0, d.radius);
        return t => {
          d.r = i(t);
          simulation.force('collide', forceCollide);
        };
      });

    node
      .append('clipPath')
      .attr('id', d => `clip-${d.id}`)
      .append('use')
      .attr('xlink:href', d => `#${d.id}`);

    // display text as circle icon
    node
      .append('text')
      .classed('node-icon', true)
      .attr('clip-path', d => `url(#clip-${d.id})`)
      .selectAll('tspan')
      .data(d => [d.name, undefined])
      .enter()
      .append('tspan')
      .attr('x', 0)
      .attr('y', (d, i, nodes) => 13 + (i - nodes.length / 2 - 0.5) * 10)
      .text(name => name);

    // display image as circle icon
    /* node.filter(d => String(d.icon).includes('img/'))
          .append('image')
          .classed('node-icon', true)
          .attr('clip-path', d => `url(#clip-${d.id})`)
          .attr('xlink:href', d => d.icon)
          .attr('x', d => -d.radius * 0.7)
          .attr('y', d => -d.radius * 0.7)
          .attr('height', d => d.radius * 2 * 0.7)
          .attr('width', d => d.radius * 2 * 0.7);
        */

    node.append('title').text(d => 'Catégorie: ' + d.cat + '\n Label: ' + d.name + '\n Valeur: ' + format(d.value));

    let legendOrdinal = legendColor()
      .shape('circle')
      .scale(scaleColor);

    // legend 1
    let legends = svg
      .append('g')
      .classed('legend-color', true)
      .attr('text-anchor', 'start')
      .attr('transform', 'translate(20,40)')
      .style('font-size', '12px');

    /*
           legends.append('text')
                    .attr('text-anchor', 'start')
          .attr('transform', 'translate(0,-20)')
          .style('font-size', '14px')
          .classed('legend-color', true)
                .append('h3')
                  .attr('transform', 'translate(0,-20)')
                .attr('class', 'subtitle right')
                .html('April 1854 - March 1855');
            */

    legends
      .append('text')
      .attr('text-anchor', 'start')
      .classed('legend-label', true)
      .attr('transform', 'translate(0,-20)')
      .style('font-family', 'Merriweather-Regular')
      .style('font-size', '14px')
      .text(() => 'Catégorie :');

    legends.call(legendOrdinal);

    let infoBox = node
      .append('foreignObject')
      .classed('circle-overlay hidden', true)
      .attr('x', -350 * 0.5 * 0.8)
      .attr('y', -350 * 0.5 * 0.8)
      .attr('height', 350 * 0.8)
      .attr('width', 350 * 0.8)
      .append('xhtml:div')
      .classed('circle-overlay__inner', true);

    infoBox
      .append('h2')
      .classed('circle-overlay__title', true)
      .text(d => d.name);

    infoBox
      .append('p')
      .classed('circle-overlay__body', true)
      .html(d => d.desc);

    node.on('click', (currentNode: INode) => {
      d3.event.stopPropagation();
      let currentTarget = d3.event.currentTarget; // the <g> el

      if (currentNode === focusedNode) {
        // no focusedNode or same focused node is clicked
        return;
      }
      let lastNode = focusedNode;
      focusedNode = currentNode;

      simulation.alphaTarget(0.2).restart();
      // hide all circle-overlay
      d3.selectAll('.circle-overlay').classed('hidden', true);
      d3.selectAll('.node-icon').classed('node-icon--faded', false);

      // don't fix last node to center anymore
      if (lastNode) {
        lastNode.fx = null;
        lastNode.fy = null;
        node
          .filter((d, i) => i === lastNode.index)
          .transition()
          .duration(1000)
          .ease(d3.easePolyOut)
          .tween('circleOut', () => {
            let irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
            return t => {
              lastNode.r = irl(t);
            };
          })
          .on('interrupt', () => {
            lastNode.r = lastNode.radius;
          });
      }

      // if (!d3.event.active) simulation.alphaTarget(0.5).restart();

      d3
        .transition('')
        .duration(1000)
        .ease(d3.easePolyOut)
        .tween('moveIn', () => {
          let ix = d3.interpolateNumber(currentNode.x, centerX);
          let iy = d3.interpolateNumber(currentNode.y, centerY);
          let ir = d3.interpolateNumber(currentNode.r, centerY * 0.5);
          return function(t) {
            currentNode.fx = ix(t);
            currentNode.fy = iy(t);
            currentNode.r = ir(t);
            simulation.force('collide', forceCollide);
          };
        })
        .on('end', () => {
          simulation.alphaTarget(0);
          let $currentGroup = d3.select(currentTarget);
          $currentGroup.select('.circle-overlay').classed('hidden', false);
          $currentGroup.select('.node-icon').classed('node-icon--faded', true);
        })
        .on('interrupt', () => {
          currentNode.fx = null;
          currentNode.fy = null;
          simulation.alphaTarget(0);
        });
    });

    // blur
    d3.select(document).on('click', () => {
      let target = d3.event.target;
      // check if click on document but not on the circle overlay
      if (!target.closest('#circle-overlay') && focusedNode) {
        focusedNode.fx = null;
        focusedNode.fy = null;
        simulation.alphaTarget(0.2).restart();
        d3
          .transition('')
          .duration(1000)
          .ease(d3.easePolyOut)
          .tween('moveOut', function() {
            let ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
            return function(t) {
              focusedNode.r = ir(t);
              simulation.force('collide', forceCollide);
            };
          })
          .on('end', () => {
            focusedNode = null;
            simulation.alphaTarget(0);
          })
          .on('interrupt', () => {
            simulation.alphaTarget(0);
          });

        // hide all circle-overlay
        d3.selectAll('.circle-overlay').classed('hidden', true);
        d3.selectAll('.node-icon').classed('node-icon--faded', false);
      }
    });

    function ticked() {
      node
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .select('circle')
        .attr('r', d => d.r);
    }
  }

  /**
   * Process json Data to D3.js Pie chart format
   * @param dataDims :  string[] Selected Dimentions
   * @param rawData : array<Object> Json data
   */
  public static convertData(dataDims: string[], rawData: any) {
    const category$ = d => d[_.head(dataDims[0])];
    const label$ = d => d[_.head(dataDims[1])];
    const value$ = d => d[_.head(dataDims[2])];

    const desc$ = d => d[_.head(dataDims[3])];

    const groubByFunc = (category$: Function, label$: Function) => d => category$(d) + '#' + label$(d);

    function sum(d: any) {
      return {
        cat: category$(_.head(d)),
        name: label$(_.head(d)),
        value: _.reduce(d, (total, el) => total + value$(el), 0),
        desc: desc$(_.head(d))
      };
    }

    return _.chain(rawData)
      .groupBy(groubByFunc(category$, label$))
      .map(sum)
      .value();
  }

  // FIXME
  load() {}

  // FIXME
  ease() {}
}

interface INode {
  id: string;
  cat: string;
  desc: string;
  fx: any;
  fy: any;
  // icon: string;
  index: number;
  name: string;
  r: number;
  radius: number;
  value: any;
  vx: number;
  vy: number;
  x: number;
  y: number;
}
