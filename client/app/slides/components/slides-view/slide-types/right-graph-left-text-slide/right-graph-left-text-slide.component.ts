import { Component, OnInit, AfterContentInit, OnChanges, SimpleChanges, Input, ViewChild, ViewChildren, ComponentFactoryResolver, ViewContainerRef, ComponentRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Slide } from "../../../../models";
import { PageConfig, HALF_HALF_LAYOUT } from "../../pageConfig";
import { Chart } from "../../../../../charts/chart.class";
import { ChartsService } from "../../../../services";

@Component({
    selector: 'app-right-graph-left-text-slide',
    templateUrl: './right-graph-left-text-slide.component.html',
    styleUrls: ['./right-graph-left-text-slide.component.scss']

})

export class RightGraphLeftTextSlideComponent implements OnInit, AfterContentInit, OnChanges {

    @Input() slide: Slide;
    @ViewChild('parent', { read: ViewContainerRef }) parent: ViewContainerRef;
    componentRef: ComponentRef<any>;
    config: PageConfig;

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private chartsService: ChartsService) { }

    ngOnInit() {
        this.setConfig();
    }

    ngAfterContentInit() {
        this.resolveCmp();
    }

    ngOnChanges(changes: SimpleChanges) {
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
