import { Component, OnInit, OnDestroy, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
    selector: 'app-treemap-chart',
    templateUrl: './treemap-chart.component.html',
    styleUrls: ['./treemap-chart.component.scss']
})
export class TreemapChartComponent extends Chart implements OnInit, OnChanges, OnDestroy {

    chartOptions: any;

    data: any[];
    private activated: boolean = true;
    private _setIntervalHandler: any;

    constructor() { super() }

    ngOnChanges() {
        d3.select("#TreemapChartComponent").remove();
        this.init();
    }
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
    public static convertData(dataDims: string[], rawData: any) {
        if (dataDims === undefined || rawData === undefined) return null;
        const key$ = d => d[dataDims[0]];
        const value$ = d => d3.sum(d, (s: any) => s[dataDims[1]]);

        return (<any>nest())
            .key(key$)
            .rollup(value$)
            .entries(rawData)
            .map(seriesPoints);;

        function seriesPoints(d) {
            return {
                name: d.key,
                value: d.value,
            };
        }
    }

    setData(graphData, graphConfig) {
        this.chartOptions = { ...this.chartOptions, ...graphConfig };
        this.data = graphData;
    }

    init() {
        this.data = TreemapChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
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
