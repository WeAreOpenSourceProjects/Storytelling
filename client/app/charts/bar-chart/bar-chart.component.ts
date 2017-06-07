import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import {Chart} from '../chart.class';
@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends Chart implements OnInit {

    @ViewChild('chart') private chartContainer: ElementRef;
    private data: Array<any> = sample;
    private margin: any = { top: 0, bottom: 0, left: 40, right: 40 };
    private chart: any;
    private width: number;
    private height: number;
    private xScale: any;
    private yScale: any;
    private colors: any;
    private xAxis: any;
    private yAxis: any;
    private loaded: boolean = true;
    
    constructor() { 
       super()  
    }

    ngOnInit() {
        // Set data
        this.data = this.dataInput;
        
        this.init();
    }

    createChart() {
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

        let svg = d3.select(element).append('svg')
            .attr('width', element.offsetWidth)
            .attr('height', element.offsetHeight);

        // chart plot area
        this.chart = svg.append('g')
            .attr('class', 'bars')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // define X & Y domains
        let xDomain = this.data.map(d => d.index);
        let yDomain = [0, d3.max(this.data, d => d.value)];

        // create scales
        this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
        this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

        // bar colors
        this.colors = d3.scaleOrdinal(d3.schemeCategory20);

        // x & y axis
        this.xAxis = svg.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));
        this.yAxis = svg.append('g')
            .attr('class', 'axis axis-y')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));



        // update scales & axis
        this.xScale.domain(this.data.map(d => d.index));
        this.yScale.domain([0, d3.max(this.data, d => d.value)]);
        //this.colors.domain([0, this.data.length]);
        this.xAxis.transition().call(d3.axisBottom(this.xScale));
        this.yAxis.transition().call(d3.axisLeft(this.yScale));


        let bars = this.chart.selectAll('.bar')

        bars.transition()
            .attr('x', d => this.xScale(d.index))
            .attr('y', d => this.yScale(d.value))
            .attr('width', d => this.xScale.bandwidth())
            .attr('height', d => this.height - this.yScale(d.value))
            .style('fill', (d, i) => this.colors(i));


        bars.data(this.data)
            .enter()
            .append("g")
            .attr('class', 'bar-block')
            .on('mouseover', _ => {
                d3.select(d3.event.srcElement).attr('opacity', 1)
                d3.select(d3.event.target.nextElementSibling).attr('font-size', '24px')
            })
            .on('mouseout', _ => {
                d3.select(d3.event.srcElement).attr('opacity', 0.8)
                d3.select(d3.event.target.nextElementSibling).attr('font-size', '14px')
            });

        this.chart.selectAll('.bar-block')
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => this.xScale(d.index))
            .attr('y', d => this.yScale(0))
            .attr('width', this.xScale.bandwidth())
            .attr('height', 0)
            .attr('opacity', 0.8)
            .style('fill', (d, i) => this.colors(i))


        this.chart.selectAll('.bar-block')
            .append('text')
            .attr('class', 'value-text')
            .attr('font-weight', 600)
            .attr('x', d => this.xScale(d.index) + this.xScale.bandwidth() / 2)
            .attr('y', d => this.yScale(d.value) - 5)
            .attr("text-anchor", "middle")
            .attr('fill', (d, i) => this.colors(i))
            .attr('opacity', 1)
            .text(d => d.value);

        this.chart.selectAll('.bar').transition()
            //.delay((d, i) => i * 100 + 400)
            .attr('y', d => this.yScale(d.value))
            .attr('height', d => this.height - this.yScale(d.value));

    }

    updateChart() {


    }
    setData(data) {
        if (data.length == 0) return;
        this.data = data;
    }
    init() {
        this.createChart();
    }
    load() {
        this.loaded = true;
        this.chart.selectAll('.bar')
            .attr('y', d => this.yScale(0))
            .attr('height', d => this.height - this.yScale(0))

        this.chart.selectAll('.value-text')
            .attr('opacity', 0)

        this.chart.selectAll('.bar').transition()
            .duration(1500)
            .attr('y', d => this.yScale(d.value))
            .attr('height', d => this.height - this.yScale(d.value));
        this.chart.selectAll('.value-text').transition()
            .delay(1300)
            .duration(200)
            .attr('opacity', 1);

    }
    ease() {
        this.loaded = false;
        this.chart.selectAll('.bar').transition()
            .delay((d,i)=>i*100)
            .attr('y', d => this.yScale(0))
            .attr('height', d => this.height - this.yScale(0))
        this.chart.selectAll('.value-text').transition()
            .duration(200)
            .attr('opacity', 0);
        let waitingTime = this.chart.selectAll('.bar')._groups[0].length * 100;
        /* if the chart doesn't load after certain time ( the time allows chart ease and then load again*/
        setTimeout(_ => {
            if (this.loaded) return;
            this.chart.selectAll('.bar').transition()
                .duration(1500)
                .attr('y', d => this.yScale(d.value))
                .attr('height', d => this.height - this.yScale(d.value));
            this.chart.selectAll('.value-text').transition()
                .delay(1500)
                .duration(200)
                .attr('opacity', 1);

        }, waitingTime * 2 + 400);
    }

}
const sample = [
    {
        "value": "21",
        "index": "index1"
    },
    {
        "value": "20",
        "index": "index2"
    },
    {
        "value": "20",
        "index": "index3"
    },
    {
        "value": "20",
        "index": "index4"
    },
    {
        "value": "20",
        "index": "index5"
    },
    {
        "value": "20",
        "index": "index6"
    }
]
