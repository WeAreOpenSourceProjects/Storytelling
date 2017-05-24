import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, AfterViewInit, Input, ViewChild, ViewChildren, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Slide } from "../../../../models";
import { PageConfig, HALF_HALF_LAYOUT } from "../../pageConfig";
import { Chart } from "../../../../../charts/chart.interface";
import { ChartsService } from "../../../../services";

@Component({
  selector: 'app-graph-text-slide',
  templateUrl: './graph-text-slide.component.html',
  styleUrls: ['./graph-text-slide.component.scss']
})
export class GraphTextSlideComponent implements OnInit, AfterViewInit {

  @Input() slide: Slide;
  @Input() pos: number;
  @Input() slideload$: Observable<number>;
  @Input() slideease$: Observable<number>;

  @ViewChild('parent', {read: ViewContainerRef})
  parent: ViewContainerRef;
  private componentRef: ComponentRef<Chart>;

  config: PageConfig;
  loadContentAni: boolean;
  easeContentAni: boolean;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
    private chartsService: ChartsService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(){
    this.setConfig();
  }

  ngAfterViewInit() {
    let cmpType : string = this.slide.graph.charAt(0).toUpperCase() + this.slide.graph.slice(1) + 'Component';
    this.setChart(cmpType);
    setTimeout(_ => this.initChart());
    this.slideload$.filter(n => n === this.pos).subscribe(() => {
      this.loadChart();
      this.loadContent();
    })
    this.slideease$.filter(n => n === this.pos).subscribe(() => {
      this.easeChart();
      this.easeContent();
    })
  }

  private setChart(chartType: string) {
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.chartsService.getChartType(chartType));
    this.parent.clear();
    this.componentRef = this.parent.createComponent(componentFactory);
  }

  private setConfig() {
    this.config = new PageConfig();
    Object.assign(this.config, HALF_HALF_LAYOUT);
    if (this.slide.graph == "image") {
      if (this.slide.fullScreenHtml.length)
        this.slide.fullScreenHtml = this.sanitizer.bypassSecurityTrustHtml(this.slide.fullScreenHtml) as string;
      this.config.hasImage = true;
    }
    else {
      this.config.hasChart = true;
    };
    console.log("config is",this.slide.fullScreenHtml);
  }


  private initChart() {
    if (this.config.hasChart) {
      (<Chart>this.componentRef.instance).setData(this.slide.data);
      (<Chart>this.componentRef.instance).init();
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
      setTimeout(_ => {
        this.easeContentAni = false;
        this.loadContentAni = true
      }, 625);
    }
  }

  private easeContent() {
    if (this.config.hasText) {
      this.easeContentAni = false;
      setTimeout(() => {
        this.loadContentAni = false;
        this.easeContentAni = true
      }, 0);
    }
  }

}
