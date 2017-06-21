import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, AfterContentInit, OnChanges, SimpleChanges, AfterViewInit, Input, ViewChild, ViewChildren, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
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
    @Input() pos: number;
    @Input() slideload$: Observable<number>;
    @Input() slideease$: Observable<number>;

    @ViewChild('parent', { read: ViewContainerRef })
    parent: ViewContainerRef;
    private componentRef: ComponentRef<Chart>;

    config: PageConfig;
    loadContentAni: boolean = false;
    easeContentAni: boolean = false;

    constructor(private _componentFactoryResolver: ComponentFactoryResolver,
        private chartsService: ChartsService,
        private sanitizer: DomSanitizer) { }

    ngAfterViewInit() {
    }

    ngOnInit() {
        this.setConfig();
    }

    ngAfterContentInit() {
        if (this.slide.graph === 'noGraph' || this.slide.graph === 'image') return;
        let cmpType = this.slide.graph.charAt(0).toUpperCase() + this.slide.graph.slice(1) + 'Component';
        this.setChart(cmpType);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.slide.graph === 'noGraph' || this.slide.graph === 'image') return;
        let cmpType: string = this.slide.graph.charAt(0).toUpperCase() + this.slide.graph.slice(1) + 'Component';
        this.setChart(cmpType);
    }


    private setChart(chartType: string) {
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.chartsService.getChartType(chartType));
        this.parent.clear();
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        this.componentRef = this.parent.createComponent(componentFactory);
        this.componentRef.instance.dataInput = this.slide.data; // set the input inputData of the abstract class Chart
        this.componentRef.instance.configInput = this.slide.config; // set the input inputData of the abstract class Chart
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

    private loadChart() {
      if (this.slide.text.length) {
          this.slide.text = this.sanitizer.bypassSecurityTrustHtml(this.slide.text) as string;
      }
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
            this.easeContentAni = false;
            this.loadContentAni = true;
        }
    }

    private easeContent() {
        if (this.config.hasText) {
            this.easeContentAni = false;
            this.loadContentAni = false;
            this.easeContentAni = true;
        }
    }

}
