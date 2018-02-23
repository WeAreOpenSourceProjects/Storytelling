import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { Chart } from '../chart.class';
@Component({
  selector: 'app-hierarchical-edge-bundling',
  templateUrl: './hierarchical-edge-bundling.component.html',
  styleUrls: ['./hierarchical-edge-bundling.component.scss']
})
export class HierarchicalEdgeBundlingComponent extends Chart implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;

  private data: Array<any> = [];
  private width: number;
  private height: number;
  private diameter;
  private radius;
  private innerRadius;
  private line: any;
  private link: any;
  private node: any;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private element: any;

  constructor() {
    super();
  }

  ngOnInit() {
    // Set data
    this.data = this.dataInput;
    this.element = this.chartContainer.nativeElement;
    if (this.data === undefined) return;
    this.init();
  }

  init() {
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
    this.diameter = this.height - this.margin.top - this.margin.bottom;
    //this.radius = this.diameter / 2;
    this.radius = Math.min(this.width, this.height) / 2;
    this.innerRadius = this.radius - 120;
    this.line = d3
      .radialLine()
      .curve(d3.curveBundle.beta(0.85))
      .radius(d => {
        return d['y'];
      })
      .angle(d => {
        return d['x'] / 180 * Math.PI;
      });

    const svg = d3
      .select(this.element)
      .append('svg')
      .append('g')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`)
      .style('opacity', 0);

    this.link = svg
      .append('g')
      .selectAll('.link')
      .style('opacity', 0);
    this.node = svg
      .append('g')
      .selectAll('.node')
      .style('opacity', 0);
    const cluster = d3.cluster().size([360, this.innerRadius]);

    const root = packageHierarchy(this.data).sum(d => {
      return d.size;
    });

    cluster(root);

    const link = this.link
      .data(packageImports(root.leaves()))
      .enter()
      .append('path')
      .each(d => {
        (d.source = d[0]), (d.target = d[d.length - 1]);
      })
      .attr('class', 'link')
      .attr('d', this.line);

    d3
      .select(this.element)
      .selectAll('path')
      .transition()
      .duration(4000)
      .attr('class', 'link')
      .attr('d', this.line);

    const node = this.node
      .data(root.leaves())
      .enter()
      .append('text')
      .attr('class', 'node')
      .attr('dy', '0.31em')
      .attr('text-anchor', d => {
        return d.x < 180 ? 'start' : 'end';
      })
      .text(d => {
        return d.data.key;
      })
      .style('opacity', 0)
      .on('mouseover', mouseovered)
      .on('mouseout', mouseouted);

    function mouseovered(d) {
      node.each(function(n) {
        n.target = n.source = false;
      });

      link
        .classed('link--target', function(l) {
          if (l.target === d) return (l.source.source = true);
        })
        .classed('link--source', function(l) {
          if (l.source === d) return (l.target.target = true);
        })
        .filter(function(l) {
          return l.target === d || l.source === d;
        })
        .raise();

      node
        .classed('node--target', function(n) {
          return n.target;
        })
        .classed('node--source', function(n) {
          return n.source;
        });
    }

    function mouseouted(d) {
      link.classed('link--target', false).classed('link--source', false);

      node.classed('node--target', false).classed('node--source', false);
    }
    function packageHierarchy(classes) {
      const map = {};

      function find(name, data) {
        let nodes = map[name],
          i;
        if (!nodes) {
          nodes = map[name] = data || { name: name, children: [] };
          if (name.length) {
            nodes.parent = find(name.substring(0, (i = name.lastIndexOf('.'))), []);
            if (typeof nodes.parent === 'undefined') {
              nodes.parent = { children: [] };
            }
            if (typeof nodes.parent.children === 'undefined') {
              nodes.parent.children = [];
            }
            nodes.parent.children.push(nodes);
            nodes.key = name.substring(i + 1);
          }
        }
        return nodes;
      }

      classes.forEach(d => {
        find(d.name, d);
      });

      return d3.hierarchy(map['']);
    }
    function packageImports(nodes) {
      const map = {},
        imports = [];

      // Compute a map from name to node.
      nodes.forEach(d => {
        map[d.data.name] = d;
      });

      // For each import, construct a link from the source to target node.
      nodes.forEach(d => {
        if (d.data.imports) {
          d.data.imports.forEach(i => {
            imports.push(map[d.data.name].path(map[i]));
          });
        }
      });

      return imports;
    }
    this.load();
  }

  load() {
    d3
      .select(this.element)
      .select('svg')
      .select('g')
      .transition()
      .duration(1000)
      .style('opacity', 1);

    d3
      .select(this.element)
      .selectAll('text')
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .attr('transform', d => {
        return 'rotate(' + (d['x'] - 90) + ')translate(' + (d['y'] + 8) + ',0)' + (d['x'] < 180 ? '' : 'rotate(180)');
      });
  }
  ease() {
    d3
      .select(this.element)
      .select('svg')
      .select('g')
      .transition()
      .duration(900)
      .style('opacity', 0);

    d3
      .select(this.element)
      .selectAll('text')
      .transition()
      .duration(1500)
      .attr('transform', d => {
        return 'rotate(180)translate(0,0)';
      });
  }
}
