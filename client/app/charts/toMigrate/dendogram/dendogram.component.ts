import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import {Chart} from '../../chart.class';

@Component({
  selector: 'app-dendogram',
  templateUrl: './dendogram.component.html',
  styleUrls: ['./dendogram.component.scss']
})
export class DendogramComponent extends Chart implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  private element: any;
  private data: Array<any> = [];
  private width: number;
  private height: number;
  private curtain: any; //for animation

    constructor() {
    super();
  }

  ngOnInit() {
    this.data = this.dataInput;
    this.element = this.chartContainer.nativeElement;
    this.init();
  }
  init() {
    this.width = this.element.offsetWidth ;
    this.height = this.element.offsetHeight;

    let svg = d3.select(this.element).append("svg");
    this.curtain = svg.style('opacity',0);
    svg.attr("height", this.height)
        .attr("width", this.width);
    let g = svg.append("g").attr('transform', `translate(40,${this.height / 2})`);

    let tree = d3.cluster()
        .size([this.height, this.width - 200]);

    let stratify = d3.stratify()
        .parentId(d => { return d['id'].substring(0, d['id'].lastIndexOf(".")); });

    let root = stratify(this.data)
        .sort((a, b) => { return (a.height - b.height) || a.id.localeCompare(b.id); });

    tree(root);

    let link = g.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d => {
          return "M" + d['y'] + "," + d['x']
              + "C" + (d.parent['y'] + 100) + "," + d['x']
              + " " + (d.parent['y'] + 100) + "," + d.parent['x']
              + " " + d.parent['y'] + "," + d.parent['x'];
        });

    let node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", d => { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", d => { return "translate(" + d['y'] + "," + d['x'] + ")"; })

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", 3)
        .attr("x", d=> { return d.children ? -8 : 8; })
        .style("text-anchor", d=> { return d.children ? "end" : "start"; })
        .text( d => { return d.id.substring(d.id.lastIndexOf(".") + 1); });
    this.load();
  }
  load() {
      this.curtain.transition()
          .duration(2000)
          .style('opacity',1);
  }
  ease() {
      this.curtain.transition()
          .duration(1000)
          .style('opacity',0);
  }

}
