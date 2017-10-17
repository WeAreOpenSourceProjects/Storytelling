import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { nest } from 'd3-collection';
import * as _ from 'lodash';
import { Chart } from '../chart.class';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent extends Chart implements OnInit, OnChanges {

    @ViewChild('chart') private chartContainer: ElementRef;
    private element: any;
    private data: Array<any> = [];
    private width: number;
    private height: number;
    private radius: number;
    private _current: any; // for animation
    private pieColor = d3.scaleOrdinal(d3.schemeCategory20);
    private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
    private id;
    private curtain: any;
    private chartOptions: any;

    constructor() {
        super();
    }

    ngOnInit() {
        this.chartOptions = { ...this.configInput };
        d3.select("#PieChartComponent").remove();
        this.init();
    }

    ngOnChanges(){
        d3.select("#PieChartComponent").remove();
        this.init();
    }

    init() {
        if (this.configInput != null)
            this.data = PieChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
        else
            this.data = this.dataInput;

        this.drawChart();
    }

    /**
     * Draw function for D3.js Bar chart
     */
    drawChart() {
        if(this.data===undefined) return;
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth ;
        this.height = element.offsetHeight;
        const svg = d3.select(element)
            .append('svg')
            .attr("id","PieChartComponent")
            .attr('width', element.offsetWidth)
            .attr('height', element.offsetHeight)
            .append('g')
            .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
        this.radius = Math.min(this.width, this.height) / 2;
        const values = this.data.map(data => data.value);
        const pie = d3.pie();
        const arcSelection = svg.selectAll('.arc')
            .data(pie(values))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .style("opacity", 1);
        arcSelection.append('path');
        arcSelection.append('text');
        d3.select(element).select('svg').selectAll('.arc')
            .style("opacity", 1);

        const outerRadius = this.radius - 10;
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(outerRadius);

        d3.select(element).selectAll('.arc').select('path')
            .attr('fill', (datum, index) => {
                return this.pieColor(this.data[index].name);
            })
            .transition()
            .duration(1500)
            .attrTween('d', tweenPie);

        d3.select(element).selectAll('.arc').select('text')
            .transition()
            .duration(1500)
            .style("opacity", 1)
            .attrTween('transform', tweenText)
            .text((datum, index) => this.data[index].name)
            .styleTween('text-anchor', d => {
                this._current = this._current || d;
                const interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    const d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? 'start' : 'end';
                };
            });

        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }
        function tweenText(b) {
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b);
            return function (t) { return 'translate(' + arc.centroid(i(t)) + ')rotate(' + angle(i(t)) + ')'; };
        }
        function tweenPie(b) {
            b.innerRadius = 0;
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b);
            return function (t) { return arc(i(t)); };
        }

        function angle(d) {
            const a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }
    };

    /**
     * Process json Data to D3.js Pie chart format
     * @param dataDims :  string[] Selected Dimentions
     * @param rawData : array<Object> Json data
     */
    public static convertData(dataDims: string[], rawData: any) {
        const name$ = d => d[_.head(dataDims[0])];
        const value$ = d => d[_.head(dataDims[1])];

        function sum(d: any){
            return {
                name: name$(_.head(d)),
                index: name$(_.head(d)),
                value: _.reduce(d, (total, el) => total + value$(el), 0),
                x: name$(_.head(d)),
                y: _.reduce(d, (total, el) => total + value$(el), 0)
            }
        }

        return _.chain(rawData)
            .groupBy(_.head(dataDims[0]))
            .map(sum)
            .value();

    }


    // FIXME
    load() {


    }

    // FIXME
    ease() {
        d3.selectAll('.arc')
            .transition()
            .duration(900)
            .style("opacity", 0);
    }
}
