import { Component, OnInit, Input, ViewChild, ViewChildren, OnChanges } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Observable } from "rxjs/Observable";
import { Slide } from "../../../../models";
import { PageConfig, FULL_LAYOUT } from "../../pageConfig";
import { Chart } from "../../../../../charts/chart.class";

@Component({
    selector: 'app-text-slide',
    templateUrl: './text-slide.component.html',
    styleUrls: ['./text-slide.component.scss']
})
export class TextSlideComponent implements OnInit, OnChanges {

    @Input() slide: Slide;
    config: PageConfig;
    slideBkg: string;

    constructor(private sanitizer: DomSanitizer) {
        this.initConfig();
    }

    ngOnInit() {
      //  this.setConfig();
    }
    ngOnChanges(changes) {
        if (changes.hasOwnProperty("slide")) {
            this.setConfig();
        }
    }
    private initConfig() {
        this.config = new PageConfig();
        Object.assign(this.config, FULL_LAYOUT);

    }
    private setConfig() {
        if (this.slide.text) this.config.hasText = true;
        if (this.slide.pageLayout === 'textInCenterImageBackground') {
            this.config.hasImage = true;
        }
        if (this.slide.slideImage) {
            this.slideBkg = this.sanitizer.bypassSecurityTrustStyle('url(' + this.slide.slideImage + ')') as string; //sanilize slideImage string
            this.config.hasImage = true;
        }
        else {
            this.slideBkg = "";
            this.config.hasImage = false;
        }


    }


}
