import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, AfterContentInit, OnChanges, SimpleChanges, Input, ViewChild, ViewChildren, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Slide } from "../../../../models";
import { PageConfig, FULL_LAYOUT } from "../../pageConfig";
import { Chart } from "../../../../../charts/chart.class";
import { ChartsService } from "../../../../services";
@Component({
    selector: 'app-full-screen-graph-slide',
    templateUrl: './full-screen-graph-slide.component.html',
    styleUrls: ['./full-screen-graph-slide.component.scss']
})
export class FullScreenGraphSlideComponent implements OnInit, AfterContentInit, OnChanges {

    @Input() slide: Slide;
    // @Input() pos: number;
    // @Input() slideload$: Observable<number>;
    // @Input() slideease$: Observable<number>;

    @ViewChild('parent', { read: ViewContainerRef })
    parent: ViewContainerRef;
    private componentRef: ComponentRef<any>;

    config: PageConfig;
    loadContentAni: boolean;
    easeContentAni: boolean;

    constructor(private _componentFactoryResolver: ComponentFactoryResolver,
        private chartsService: ChartsService,
        private sanitizer: DomSanitizer) { }


    ngAfterViewInit() {

    }

    ngOnInit() {
        this.setConfig();
    }


    ngAfterContentInit() {

        if (this.slide.graph === 'noGraph') return;
        let cmpName: string;
        console.log(this.slide)
        if (this.slide.config && this.slide.config.chartType
            && this.slide.config.chartType.cmpName != null) {
            cmpName = this.slide.config.chartType.cmpName;
        } else {
            cmpName = this.slide.graph;
        }

        let cmpType: string = cmpName.charAt(0).toUpperCase() + cmpName.slice(1) + 'Component';
        this.setChart(cmpType);
    }

    ngOnChanges(changes: SimpleChanges) {
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
        if (this.parent)
            this.parent.clear();
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        if (this.chartsService.getChartType(chartType) === undefined) return;
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.chartsService.getChartType(chartType));
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
        Object.assign(this.config, FULL_LAYOUT);
        this.slide.text = this.sanitizer.bypassSecurityTrustHtml(this.slide.text) as string;

        this.loadContentAni = true;
        this.easeContentAni = false;

        if (this.slide.graph == "image") {
            this.config.hasImage = true;
        }
        else {
            this.config.hasChart = true;
        }
    }

    private loadChart() {
        if (this.config.hasChart) {
            (<Chart>this.componentRef.instance).load();
        }
    }

    private easeChart() {
        if (this.config.hasChart) {
            (<Chart>this.componentRef.instance).ease();
        }
    }


    private loadContent() {
        if (this.config.hasText) {
            this.loadContentAni = false;
            //setTimeout(_ => {
            this.easeContentAni = false;
            this.loadContentAni = true
            //  }, 625);
        }
    }

    private easeContent() {
        if (this.config.hasText) {
            this.easeContentAni = false;
            //  setTimeout(() => {
            this.loadContentAni = false;
            this.easeContentAni = true
            //  }, 0);
        }
    }

}
