import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import {HierarchyNode} from 'd3'

import {Chart} from '../chart.class';

@Component({
    selector: 'app-treemap-chart',
    templateUrl: './treemap-chart.component.html',
    styleUrls: ['./treemap-chart.component.scss']
})
export class TreemapChartComponent extends Chart implements OnInit {
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

    constructor() {
       super()
    }

    ngOnInit() {
        // Set data
        this.data = this.dataInput[0];

        this.init();
    }

    init() {
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

        // x and y definition
        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([0, this.height]);

        // Color definition
        let colorDomain = ['#FF8A8A','#C58AFF', '#FF8AC5', '#FFC875', '#F8FF86', '#86FF6a', '#7DF5FF', '#8AFFC5', '#BED2ED'];
        let color = d3.scaleOrdinal(colorDomain);

        let format = d3.format(",d");

        // Chart construction
        this.chart = d3.select(element).append('svg')
            .attr("class", "svg")
            .attr('width', this.width)
            .attr('height', this.height);

        let treemap = d3.treemap()
            .tile(d3.treemapResquarify)
            .size([this.width, this.height])
            .round(true);

/*
    d3.csv("./client/app/charts/treemap-chart/flare.csv", (error, flatData) => {
        if (error) throw error;

        // assign null correctly
        flatData.forEach(function(d) {
            if (d.size == "null") { d.size = null};
        });

        // convert the flat data into a hierarchy (treeData = json to record)
        let treeData = d3.stratify()
                        .id(function(d: any) { return d.name; })
                        .parentId(function(d: any) {
                var i = d.name.lastIndexOf(".");
                return i >= 0 ? d.name.slice(0, i) : null;
            })(flatData);

        // assign the name to each node
        treeData.each(function(d: any) {
            var i = d.id.lastIndexOf(".");
             d.name =  i >= 0 ? d.id.slice(i+1, d.id.length) : d.id;
        });

        //  assigns the data to a hierarchy using parent-child relationships
        this.root = d3.hierarchy(treeData
            .eachBefore(function(d: any) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name })
            .sum(function(d: any) {return d.size})
            .sort((a, b) =>  b.height - a.height || b.value - a.value));
    });
*/

        this.root = d3.hierarchy(this.data)
            .eachBefore(d => { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name })
            .sum(d => d.size)
            .sort((a, b) =>  b.height - a.height || b.value - a.value);

        this.node = this.root;

        treemap(this.root);

        let cell = this.chart.selectAll("g")
            .data(this.root.leaves())
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", d => "translate(" + d['x0'] + "," + d['y0'] + ")")
            .on("click", d => this.zoom(this.node == d.parent ? this.root : d.parent, this.xScale, this.yScale));

        cell.append("rect")
            .attr("id", d => d.data.id)
            .attr("width", d => d['x1'] - d['x0'] - 1)
            .attr("height", d => d['y1'] - d['y0'] - 1)
            .attr("fill", d => color(d.parent.data.id));

        cell.append("text")
            .attr("x", d => (d['x1'] - d['x0'])/2)
            .attr("y", d => (d['y1'] - d['y0'])/2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => d.data.name)
            .style("opacity", function(d) {
                let stringLength = (<SVGTSpanElement>this).getComputedTextLength();
                return (d['x1'] - d['x0']) > stringLength ? 1 : 0;
            });

        /* Add 'curtain' rectangle to hide entire graph */
        this.curtain = this.chart.append("g").append('rect')
            .attr('x', -1 * this.width)
            .attr('y', -1 * this.height)
            .attr('height', this.height)
            .attr('width', 0)
            .attr('class', 'curtain')
            .attr('transform', 'rotate(180)')
            .style('fill', '#fafafa')

        cell.append("title")
            .text(d => d.data.id + "\n" + format(d.value));

        // When we click outside the graph, we reinit it
        d3.select(window).on("click", () => this.zoom(this.root, this.xScale, this.yScale));
    }

    private zoom(d, x, y) {
        // Ratio
        let kx = this.width / (d['x1'] - d['x0']);
        let ky = this.height / (d['y1'] - d['y0']);

        // New x and y domains
        x.domain([d['x0'], d['x1']]);
        y.domain([d['y0'], d['y1']]);

        // Cells translation
        let t = this.chart.selectAll("g.cell").transition()
            .duration(750)
            .attr("transform", function(d) { return "translate(" + x(d['x0']) + "," + y(d['y0']) + ")"; });

        // Rect new dimensions
        t.select("rect")
            .attr("width", function(d) { return kx * (d['x1'] - d['x0']) - 1; })
            .attr("height", function(d) { return ky * (d['y1'] - d['y0']) - 1; })

        // Text position
        t.select("text")
            .attr("x", function(d) { return kx * (d['x1'] - d['x0']) / 2; })
            .attr("y", function(d) { return ky * (d['y1'] - d['y0']) / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("opacity", function(d) {
                let stringLength = (<SVGTSpanElement>this).getComputedTextLength();
                return (kx * (d['x1'] - d['x0'])) > stringLength ? 1 : 0;
            });

        this.node = d;
        d3.event.stopPropagation();
    }

    load() {
        this.curtain
            .attr('width', this.width);

        this.curtain.transition()
            .duration(2000)
            .attr('width', 0);
     }

    ease() {
        this.curtain.transition()
            .duration(1250)
            .attr('width', this.width);
    }
}
