import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Slide } from "../../../../models";
import { PageConfig, FULL_LAYOUT } from "../../pageConfig";
import { Chart } from "../../../../../charts/chart.class";


@Component({
    selector: 'app-text-slide',
    templateUrl: './text-slide.component.html',
    styleUrls: ['./text-slide.component.scss']
})
export class TextSlideComponent implements OnInit {


    @Input() slide: Slide;
    @Input() pos: number;
    @Input() slideload$: Observable<number>;
    @Input() slideease$: Observable<number>;
    @ViewChild('chart') chartEle: Chart;
    config: PageConfig;
    loadContentAni: boolean;
    easeContentAni: boolean;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.setConfig();
        this.slideload$.filter(n => n === this.pos).subscribe(() => {
            this.loadContent();
        })
        this.slideease$.filter(n => n === this.pos).subscribe(() => {
            this.easeContent();
        })
    }

    private setConfig() {
        this.config = new PageConfig();
        Object.assign(this.config, FULL_LAYOUT);
        this.config.hasText = true;

        if (this.slide.pageLayout === 'textInCenterImageBackground') {
            this.config.hasImage = true;
        }

    }


    private loadContent() {
        if (this.config.hasText) {
            if (this.slide.text.length) {
                console.log("text")
                this.slide.text = this.sanitizer.bypassSecurityTrustHtml(this.slide.text) as string;
            }
            this.loadContentAni = false;
            //  setTimeout(_ => {
            this.easeContentAni = false;
            this.loadContentAni = true
            //}, 625);
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
