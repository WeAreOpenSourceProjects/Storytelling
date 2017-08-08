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
    private config: PageConfig;
    private slideBkg:string;

    constructor() { }

    ngOnInit() {
        this.setConfig();
    }

    private setConfig() {
        this.config = new PageConfig();
        Object.assign(this.config, FULL_LAYOUT);
        this.config.hasText = true;

        if (this.slide.pageLayout === 'textInCenterImageBackground') {
            this.config.hasImage = true;
        }

    }


}
