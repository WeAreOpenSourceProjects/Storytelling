import { Component, OnInit, Inject, ViewChildren, ViewChild, ViewContainerRef, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { WindowResizeService } from '../../services/window-resize.service';

import {DOCUMENT, DomSanitizer} from '@angular/platform-browser';
import {SlidesService} from '../../services/slides.service';
import {ImagesService} from '../../services/images.service';
import { BarChartComponent, ForceDirectedGraphComponent, LineChartComponent, HierarchicalEdgeBundlingComponent} from 'app/charts';

import { PageConfig, HALF_HALF_LAYOUT, FULL_LAYOUT} from './pageConfig';

import { slideTransition } from "./slide.animation";
import * as screenfull from 'screenfull';
import {NotifBarService} from "app/core";
@Component({
    selector: 'app-slides-view',
    templateUrl: './slides-view.component.html',
    styleUrls: ['./slides-view.component.scss'],
    animations: [slideTransition()],
    providers: [WindowResizeService, SlidesService]
})

export class SlidesViewComponent implements OnInit {
    slides: Array<any> = [];
    slideTitle: String;
    slideHeight_style: any = {
        'height': '72px'
    };
    contentHeight_style: any = {
        'height': '72px'
    };
    slideHeight: number;
    curSlideIndex: number = 0;
    direction: number = 1;
    currentSlide: any;
    slideNum: number;
    charts: Array<any> = [];
    loadContentAni: Array<boolean> = []; // indicator for content load animation
    easeContentAni: Array<boolean> = []; // indicator for content ease(fade away) animation
    pageLayoutConfig: Array<any> = [];
    inEaseProcess = false;
    screenfull: any;
    showFullScreen: boolean = false;

    slideload$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    slideease$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    @ViewChildren('chart') chartEle: any;

    @ViewChild('slider', { read: ViewContainerRef })
    slider: ViewContainerRef;


    constructor(
        private windowResizeService: WindowResizeService,
        private slidesService: SlidesService,
        private imagesService: ImagesService,
        @Inject(DOCUMENT) private document: any,
        private sanitizer: DomSanitizer,
        private router: Router,
        private route: ActivatedRoute,
        private notifBarService: NotifBarService
    ) {
        this.windowResizeService.height$.subscribe(height => {
            this.slideHeight_style = {
                'height': (height - 70) + 'px' //70 is the height of header
            };
            this.contentHeight_style = {
                'height': (height - 70 - 50) + 'px'
            }
            this.slideHeight = (height - 70);
        })
        this.screenfull = screenfull;

    }
    ngOnInit() {
        let id;
        this.route.params.subscribe(params => {
            id = params['id'];
        });
        /* generate and initialize slides*/
        this.slidesService.getSlides(id).subscribe(
            slide => {
                this.slides = slide.slides;
                this.slideNum = this.slides.length;
                this.slideTitle = slide.slidesSetting.title;
                this.slides.forEach(s => {
                    if (s.text.length) {
                        s.text = this.sanitizer.bypassSecurityTrustHtml(s.text) as string;
                    }
                    if (s.slideImage) {
                        this.imagesService.getImage(s.slideImage).subscribe(img => s.slideImage = img
                        )
                    }
                })
            },
            error => {
                this.notifBarService.showNotif("fail to load slides, error is " + error);
            });
        window.scrollTo(0, 0);//scroll to top everytime open the slides

    }


    lastSlide() {
        this.curSlideIndex = this.getCurSlideIndex();
        if (this.curSlideIndex > 0) {
            this.slideease$.next(this.curSlideIndex);
            this.curSlideIndex--;
            this.slideload$.next(this.curSlideIndex);

        }
    }

    nextSlide() {
        this.curSlideIndex = this.getCurSlideIndex();
        if (this.curSlideIndex < this.slideNum) {
            this.slideease$.next(this.curSlideIndex);
            this.curSlideIndex++;
            this.slideload$.next(this.curSlideIndex);
            /*add animation to text content*/
        }
    }

    scroll2Slide(event) {
        let scrollDis = document.body.scrollTop;
        let curIndex = Math.round(scrollDis / this.slideHeight);
        if (curIndex !== this.curSlideIndex) {
            this.slideease$.next(this.curSlideIndex);
            this.slideload$.next(curIndex);
            this.curSlideIndex = curIndex;
        }
    }

    switchSlide(direction: number) {
        let nextIndex = this.curSlideIndex + direction;
        if (nextIndex >= 0 && nextIndex <= this.slideNum) {
            this.curSlideIndex = nextIndex;
            this.currentSlide = this.slides[this.curSlideIndex - 1];
            this.direction = direction;
        }
        //hide full screen
        this.showFullScreen = false;
    }

    animationDone(event: any) {

        //  this.direction = 0; ==> if add this line, will get error:ExpressionChangedAfterItHasBeenCheckedError
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.showFullScreen = true;
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.showFullScreen = false;
    }

    staySlideProcess() {

    }

    onClick() {
        if (this.screenfull.enabled) {
            this.screenfull.toggle(this.slider.element.nativeElement);

        }
    }

    private getCurSlideIndex(): number {
        let scrollDis = document.body.scrollTop;
        let curIndex = Math.round(scrollDis / this.slideHeight);
        return curIndex;
    }

    check() {
        return true;
    }
}
