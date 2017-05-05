import { Component, OnInit } from '@angular/core';
import { WindowResizeService } from '../../services/window-resize.service';
import {SlidesService} from '../../services/slides.service';
import { Router } from '@angular/router';
import { select } from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';

import {Slides} from '../../models/slides'
@Component({
    selector: 'app-slides-list',
    templateUrl: './slides-list.component.html',
    styleUrls: ['./slides-list.component.scss'],
    providers: [WindowResizeService, SlidesService]
})
export class SlidesListComponent implements OnInit {
    @select(['session', 'token']) loggedIn$: Observable<string>;
    slides: Array<Slides> = [];
    listHeight_style: any = {
        'height': '350px'
    };
    constructor(
        private windowResizeService: WindowResizeService,
        private slidesService: SlidesService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.slidesService.getSlidesList()
            .subscribe(
            slide => {
                console.log(slide);
                /*slide.forEach(s => this.slides.push(new SlidesListItem(s.slidesSetting)))*/
                this.slides=slide;
                console.log(this.slides);
            },
            error => {
                console.log('fail to get Slides list');
            });
        console.log(this.slides);
    }

    search(text) {
        if (text) {
            this.slidesService.getSlideToSearch(text)
                .subscribe(slides => {
                    this.slides = [];
                    this.slides=slides;
                    /*slides.forEach(s => this.slides.push(new SlidesListItem(s)))*/
                });
        }
    }
    shortText() {
        this.slidesService.getSlidesList()
            .subscribe(
            slides => {
                this.slides = [];
                this.slides=slides;
                console.log("get",this.slides)
                /*slides.forEach(s => this.slides.push(new SlidesListItem(s)));*/
            },
            error => {
                console.log('fail to get Slides list');
            });
    }

    publish(e) {
        e.slidesSetting.public = !e.slidesSetting.public;
        this.slidesService.updateSlide(e, e._id)
            .subscribe(elm => console.log(elm.slidesSetting.public));
    }
    test() {
        console.log(this.slides);
    }
}
