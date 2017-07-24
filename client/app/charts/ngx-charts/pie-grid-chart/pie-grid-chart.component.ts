import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import * as shape from 'd3-shape';
import * as d3 from 'd3';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Chart } from '../../chart.class';
import { nest } from 'd3-collection';
const defaultOptions = {
    view: [1200, 800],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    colorScheme: {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    },
    autoScale: true
};
@Component({
    selector: 'app-pie-grid-chart',
    templateUrl: './pie-grid-chart.component.html',
    styleUrls: ['./pie-grid-chart.component.scss']
})
export class PieGridChartComponent extends Chart implements OnInit, OnDestroy, OnChanges {

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
    public static convertData(dataDims: string[], rawData: any) {
        if (dataDims === undefined || rawData === undefined) return null;
        const key$ = d => d[dataDims[0]];
        return nest()
            .key(key$)
            .entries(rawData)
            .map(values);

        function values(d) {
            return {
                name: d.key,
                value: d.values.map((val) => {
                    return val[dataDims[1]];
                }).reduce((ele1, ele2) => {
                    return ele1 + ele2;
                }, 0)
            };
        }
    }

    setData(graphData, graphConfig) {
        this.chartOptions = { ...this.chartOptions, ...graphConfig };
        this.data = graphData;
    }
    ngOnChanges() {
        d3.select("#PieGridChartComponent").remove();
        this.init();
    }
    init() {
        this.data = PieGridChartComponent.convertData(this.chartOptions.dataDims, this.dataInput);
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
