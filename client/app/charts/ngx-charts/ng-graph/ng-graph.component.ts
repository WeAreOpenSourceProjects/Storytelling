import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as shape from 'd3-shape';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
import * as d3 from 'd3';
const defaultOptions = {
    view: [900, 600],
    colorScheme: colorSets.find(s => s.name === 'cool'),
    schemeType: 'ordinal',
    showLegend: true,
    legendTitle: 'Legend',
    gradient: false,
    showXAxis: true,
    showYAxis: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    yAxisLabel: '',
    xAxisLabel: '',
    autoScale: true,
    showGridLines: true,
    rangeFillOpacity: 0.5,
    roundDomains: false,
    tooltipDisabled: false,
    showSeriesOnHover: true,
    curve: shape.curveLinear,
    curveClosed: shape.curveCardinalClosed
};

@Component({
    selector: 'app-ng-graph',
    templateUrl: './ng-graph.component.html',
    styleUrls: ['./ng-graph.component.scss']
})
export class NgGraphComponent extends Chart implements OnInit, OnDestroy {

    chartOptions: any;

    data: any[];
    private activated: boolean = true;
    private _setIntervalHandler: any;

    constructor() { super() }

    ngOnInit() {
        // Set the config
        this.chartOptions = { ...defaultOptions, ...this.configInput };

        this.init();

    }

    /**
     * Process json Data to Ngx-charts format
     * @param dataDims :  string[] Selected Dimentions
     * @param rawData : array<Object> Json data
     */
    public static convertSingleData(dataDims: string[], rawData: any) {
        console.log("dataDims", dataDims);
        console.log("rawData", rawData);
        const key$ = d => d[dataDims[0]];
        const name$ = d => d[dataDims[1]];
        const value$ = d => d[dataDims[2]];
        const value2$ = d => d[dataDims[3]];
        console.log(key$, name$, value$, value2$)
        let result = nest()
            .key(key$)
            //  .key(name$)
            .rollup((v):any=> { return d3.sum(v, d=>  d[dataDims[2]] ); })
            .entries(rawData)
            .map(series);

        return result;
        function series(d) {
            return {
                name: d.key,
                value: d.value
            };
        }
    }
    public static convertData(dataDims: string[], rawData: any) {
        console.log("dataDims", dataDims);
        console.log("rawData", rawData);
        const key$ = d => d[dataDims[0]];
        const name$ = d => d[dataDims[1]];
        const value$ = d => d[dataDims[2]];
        const value2$ = d => d[dataDims[3]];
        console.log(key$, name$, value$, value2$)
        return nest()
            .key(key$)
            .entries(rawData)
            .map(series);

        function series(d) {
            return {
                name: d.key,
                series: d.values.map(seriesPoints)
            };
        }

        function seriesPoints(d) {
            return {
                name: name$(d),
                value: value$(d),
                x: name$(d),
                y: value$(d),
                r: value2$(d)
            };
        }
    }
    setData(graphData, graphConfig) {
        this.chartOptions = { ...this.chartOptions, ...graphConfig };
        this.data = graphData;
    }

    init() {
        this.data = NgGraphComponent.convertData(this.chartOptions.dataDims, this.dataInput);
    }

    load() {
        // this.data = [];
        // this._setIntervalHandler =  setTimeout(() => this.data = this.dataInput);
    }

    ease() {
    }

    select(data) {
        console.log('Item clicked', data);
    }

    onLegendLabelClick(entry) {
        console.log('Legend clicked', entry);
    }

    ngOnDestroy() {
        clearTimeout(this._setIntervalHandler);
    }

}
