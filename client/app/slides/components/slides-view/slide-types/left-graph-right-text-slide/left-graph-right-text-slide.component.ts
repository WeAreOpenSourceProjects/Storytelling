import { Component, OnInit, AfterContentInit, OnChanges, SimpleChanges, Input, ViewChild, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Slide } from "../../../../models";
import { PageConfig, HALF_HALF_LAYOUT } from "../../pageConfig";
import { Chart } from "../../../../../charts/chart.class";
import { ChartsService } from "../../../../services";

@Component({
    selector: 'app-left-graph-right-text-slide',
    templateUrl: './left-graph-right-text-slide.component.html',
    styleUrls: ['./left-graph-right-text-slide.component.scss']
})
export class LeftGraphRightTextSlideComponent implements OnInit, AfterContentInit, OnChanges {

    @Input() slide: Slide;

    @ViewChild('parent', { read: ViewContainerRef })
    parent: ViewContainerRef;
    private componentRef: ComponentRef<any>;
    private config: PageConfig;

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private chartsService: ChartsService) { }


    ngOnInit() {
        this.setConfig();
    }

    ngAfterContentInit() {
        this.resolveCmp();
    }

    ngOnChanges() {
        this.resolveCmp();
    }
    private resolveCmp() {
        if (this.slide.graph === 'noGraph') return;
        let cmpName: string;

        if (this.slide.config && this.slide.config.chartType
            && this.slide.config.chartType.cmpName != null) {
            cmpName = this.slide.config.chartType.cmpName;
        } else {
            cmpName = this.slide.graph;
        }

        let cmpType: string = cmpName.charAt(0).toUpperCase() + cmpName.slice(1) + 'Component';
        this.setChart(cmpType);
    }

    private setChart(chartType: string) {
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.chartsService.getChartType(chartType));
        this.parent.clear();
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        this.componentRef = this.parent.createComponent(componentFactory);
        if (chartType == 'ImageComponent') {
            console.log("get path");
            if (this.slide.slideImage) this.componentRef.instance.path = this.slide.slideImage.path;
        }
        else {
            this.componentRef.instance.dataInput = this.slide.data; // set the input inputData of the abstract class Chart
            this.componentRef.instance.configInput = this.slide.config; // set the input inputData of the abstract class Chart
        }

    }

    private setConfig() {
        this.config = new PageConfig();
        Object.assign(this.config, HALF_HALF_LAYOUT);

        if (this.slide.graph == "image") {
            this.config.hasImage = true;
        }
        else {
            this.config.hasChart = true;
        };
    }
}
