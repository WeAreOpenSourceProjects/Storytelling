import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, AfterContentInit, OnChanges, SimpleChanges, AfterViewInit, Input, ViewChild, ViewChildren, ComponentFactoryResolver, ViewContainerRef, ComponentRef, ChangeDetectionStrategy } from '@angular/core';
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

export class RightGraphLeftTextSlideComponent implements OnInit, AfterContentInit, OnChanges  {

  @Input() slide: Slide;
  @Input() pos: number;
  @Input() slideload$: Observable<number>;
  @Input() slideease$: Observable<number>;

  @ViewChild('parent', { read: ViewContainerRef })
  parent: ViewContainerRef;
  private componentRef: ComponentRef<any>;

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
        if (this.slide.graph === 'noGraph') return;
        let cmpName: string;

        if(this.slide.config && this.slide.config.chartType
        && this.slide.config.chartType.cmpName != null){
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

        if(this.slide.config && this.slide.config.chartType
        && this.slide.config.chartType.cmpName != null){
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
/*
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
*/
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

    // private loadChart() {
    //   if (this.config.hasChart) {
    //     (<Chart>this.componentRef.instance).load();
    //   }
    // }

    // private easeChart() {
    //   if (this.config.hasChart) {
    //     (<Chart>this.componentRef.instance).ease();
    //   }
    // }


    // private loadContent() {
    //   if (this.config.hasText) {
    //     this.loadContentAni = false;
    //     setTimeout(_ => {
    //       this.easeContentAni = false;
    //       this.loadContentAni = true;
    //     }, 150);
    //   }
    // }

    // private easeContent() {
    //   if (this.config.hasText) {
    //     this.easeContentAni = false;
    //     setTimeout(() => {
    //       this.loadContentAni = false;
    //       this.easeContentAni = true;
    //     }, 0);
    //   }
    // }

}
