import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as shape from 'd3-shape';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
import * as _ from 'lodash';

const defaultOptions = {
    view: [2000, 2000],
    colorScheme: colorSets.find(s => { if (s === undefined) return; else return s.name === 'cool'}),
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
    public static convertData(dataDims: string[][], rawData: any) {
        if (dataDims === undefined || rawData === undefined) return;
        const key$ = d => d[_.head(dataDims[0])];
        const name$ = d => d[_.head(dataDims[1])];
        const value$ = d => d[_.head(dataDims[2])];
        const value2$ = d => d[_.head(dataDims[3])];

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
