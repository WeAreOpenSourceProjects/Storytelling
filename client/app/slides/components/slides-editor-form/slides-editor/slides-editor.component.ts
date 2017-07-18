import { Component, Input, Output, EventEmitter, QueryList, OnChanges, ViewEncapsulation, ViewChildren } from '@angular/core';
import {Slides} from '../../../models/slides';
import {Slide} from '../../../models/slide';
import { DragulaService } from 'ng2-dragula';
import {ValidService} from '../../../services/valid.service';
import {NotifBarService} from 'app/core';
@Component({
    selector: 'app-slides-editor',
    templateUrl: './slides-editor.component.html',
    styleUrls: ['./slides-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SlidesEditorComponent implements OnChanges {

    slider: Slides = new Slides(); // the whole slides
    curSlideIndex = 1; // the slide that will be created(the amounts of slides pages +1 )

    isValidated = false;
    isValidatedSlide = true;
    isValidatedSetting = false;

    isInShuffle = false;
    shuffleOrder: Array<number> = [];
    slideOpendIndex: number;
    shuffleTransition = {
        drag: 0,
        drop: 0
    };

    @Input() sliderIpt: Slides;

    @Output() submit = new EventEmitter();
    @Output() bannerImageUpload = new EventEmitter();

    constructor(private dragulaService: DragulaService, private validService: ValidService, private notifBarService: NotifBarService) {
        dragulaService.drag.subscribe(value => {
            this.onDrag(value.slice(1));
        });
        dragulaService.drop.subscribe((value: any) => {
            this.onDrop(value.slice(1));
        });
        dragulaService.over.subscribe((value: any) => {
            this.onOver(value.slice(1));
        });
        dragulaService.out.subscribe((value: any) => {
            this.onOut(value.slice(1));
        });
    }
    ngOnChanges() {
        if (this.sliderIpt) {
            this.slider = this.sliderIpt;
            this.curSlideIndex = this.slider.slides.length + 1;
            this.isValidated = true;
        }
    }

    /* functions for shuffle slides drop down operation */
    private hasClass(el: any, name: string): any {
        return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
    }

    private addClass(el: any, name: string): void {
        if (!this.hasClass(el, name)) {
            el.className = el.className ? [el.className, name].join(' ') : name;
        }
    }

    private removeClass(el: any, name: string): void {
        if (this.hasClass(el, name)) {
            el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
        }
    }

    private onDrag(args: any): void {
        let [el] = args;
        let index = [].slice.call(el.parentElement.children).indexOf(el);
        this.shuffleTransition.drag = index;
        this.removeClass(el, 'ex-moved');
    }

    private onDrop(args: any): void {
        let [el] = args;
        let index = [].slice.call(el.parentElement.children).indexOf(el)
        this.shuffleTransition.drop = index;
        // save the changed order
        this.shuffleOrder.forEach((order, i) => {
            if (this.shuffleTransition.drag < this.shuffleTransition.drop) {
                if ((i > this.shuffleTransition.drag || i === this.shuffleTransition.drag) && i < this.shuffleTransition.drop) {
                    this.shuffleOrder[i]++;
                }
                if (i === this.shuffleTransition.drop) {
                    this.shuffleOrder[i] = this.shuffleTransition.drag;
                }
            } else if (this.shuffleTransition.drag > this.shuffleTransition.drop) {
                if ((i < this.shuffleTransition.drag || i === this.shuffleTransition.drag) && i > this.shuffleTransition.drop) {
                    this.shuffleOrder[i]--;
                }
                if (i === this.shuffleTransition.drop) {
                    this.shuffleOrder[i] = this.shuffleTransition.drag;
                }
            }
        });
        this.addClass(el, 'ex-moved');
    }

    private onOver(args: any): void {
        let [el] = args;
        this.addClass(el, 'ex-over');
    }

    private onOut(args: any): void {
        let [el] = args;
        this.removeClass(el, 'ex-over');
    }

    /* update current slides index*/
    openSlideIndex(index) {
        this.slideOpendIndex = index;
    }

    /* trigger when slides setting change*/
    slidesSettingChange(setting) {
        this.slider.slidesSetting = setting;
    }
    /* validate status change*/
    settingValidateChange(status) {
        this.isValidatedSetting = status;
        this.checkValid();
    }
    slideValidateChange(status) {
        this.isValidatedSlide = status;
        this.checkValid();
    }
    checkValid() {
        if (this.isValidatedSetting && this.isValidatedSlide) {
            this.isValidated = true;
        } else {
            this.isValidated = false;
        }
    }
    /*add a new page of slide*/
    addSlide() {
        let s = new Slide(this.curSlideIndex++);
        this.slider.slides.push(s);
        this.isValidatedSlide = false;
        this.checkValid();
    }
    /*submit a new slide*/
    submitSlide(slide) {
        /* modify slide*/
        if (slide.index < this.curSlideIndex) {
            /* slide existing */
            this.slider.slides[slide.index - 1] = Object.assign({}, slide);
        } else {
            /* create new slide*/
            this.curSlideIndex++;
            let s: Slide = Object.assign({}, slide);
            s.index = this.curSlideIndex;
            this.slider.slides.push(s);
        }
    }
    /* delete a page of slide*/
    deleteSlide(index) {
        try {
            if (index < this.curSlideIndex) {
                this.slider.slides.splice(index - 1, 1);
                /*change slide index*/
                this.slider.slides.forEach(
                    s => {
                        if (s.index > index - 1) {
                            s.index--;
                        }
                    }
                );
                /* slide deleted in local */
                this.curSlideIndex--;
            }
            this.validService.changeSlideValid(true, index, "DELETE");
        } catch (err) {
            this.notifBarService.showNotif('delete fail : '+err);
        }
    }
    /*change slide order*/
    shuffleSlide() {
        // save new order
        if (this.isInShuffle) {
            let slides = Object.assign({}, this.slider.slides);;
            this.shuffleOrder.forEach((order, i) => {
                this.slider.slides[i] = slides[order];
                this.slider.slides[i].index = i + 1;
            });
            this.isInShuffle = false;
        } else {
            // start to shuffle
            this.shuffleOrder = [];
            this.slider.slides.forEach((s, i) => {
                this.shuffleOrder.push(i);
            });

            this.isInShuffle = true;
        }

    }
    /* clear change of shuffle*/
    clearShuffle() {
        this.isInShuffle = false;
    }
}
