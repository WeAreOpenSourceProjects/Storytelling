import { Component, OnInit, Input, Output, EventEmitter, QueryList, OnChanges, ViewEncapsulation, ViewChildren } from '@angular/core';
import {Slides} from '../../models/slides';
import {Slide} from '../../models/slide';
import { DragulaService } from 'ng2-dragula';
import {ValidService} from '../../services/valid.service';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnChanges {

    curSlideIndex: number = 1;// the slide that will be created(the amounts of slides pages +1 )
    slider: Slides = new Slides(); // the whole slides
    isValidated: boolean = false;
    isValidatedSetting: boolean = false;
    isValidatedSlide: boolean = true;
    isInShuffle: boolean = false;
    shuffleOrder: Array<number> = [];
    shuffleTransition = {
        drag: 0,
        drop: 0
    }
    @ViewChildren("creator") _creatorEle: any;
    @Input() sliderIpt: Slides;
    @Output() submit = new EventEmitter();
    @Output() bannerImageUpload = new EventEmitter();
    //  @Output() validate= new EventEmitter();

    constructor(private dragulaService: DragulaService,private validService: ValidService) {
        dragulaService.drag.subscribe(value => {
            // value[0] will always be bag name
            this.onDrag(value.slice(1));
        });
        dragulaService.drop.subscribe((value: any) => {
            console.log(value);
            this.onDrop(value.slice(1));
        });
        dragulaService.over.subscribe((value: any) => {
            //console.log(`over: ${value[0]}`);
            this.onOver(value.slice(1));
        });
        dragulaService.out.subscribe((value: any) => {
            //console.log(`out: ${value[0]}`);
            this.onOut(value.slice(1));
        });
    }

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
        //save the changed order
        this.shuffleOrder.forEach((order, i) => {
            if (this.shuffleTransition.drag < this.shuffleTransition.drop) {
                if ((i > this.shuffleTransition.drag || i == this.shuffleTransition.drag) && i < this.shuffleTransition.drop) this.shuffleOrder[i]++;
                if (i == this.shuffleTransition.drop) this.shuffleOrder[i] = this.shuffleTransition.drag;
            }
            else if (this.shuffleTransition.drag > this.shuffleTransition.drop) {
                if ((i < this.shuffleTransition.drag || i == this.shuffleTransition.drag) && i > this.shuffleTransition.drop) this.shuffleOrder[i]--;
                if (i == this.shuffleTransition.drop) this.shuffleOrder[i] = this.shuffleTransition.drag;
            }
        })
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
    private reorder() {

    }

    ngOnInit() {
    }
    ngOnChanges() {
        if (this.sliderIpt) {
            this.slider = this.sliderIpt;
            this.curSlideIndex = this.slider.slides.length + 1;
            this.isValidated = true;
        }
    }
    /* trigger when slides setting change*/
    slidesSettingChange(setting) {

        this.slider.slidesSetting = setting;

    }
    /* validate status change*/
    settingValidateChange(status) {
        this.isValidatedSetting = status;
        this.checkValid();
        console.log("is valid",this.isValidated)
        //this.validate.emit(status);
    }
    slideValidateChange(status) {
        this.isValidatedSlide = status;
        this.checkValid();
        //this.validate.emit(status);
    }
    checkValid() {
        if (this.isValidatedSetting && this.isValidatedSlide)
            this.isValidated = true;
        else this.isValidated = false;
    }
    /*add a new slide*/
    addSlide() {
        let s = new Slide(this.curSlideIndex++);
        this.slider.slides.push(s);
        this.isValidatedSlide = false;
        this.checkValid();
    }
    /* in edit mode, save the change of a page of slide*/
    saveSlide(slide) {
        try {
            this.slider.slides[slide.index - 1] = Object.assign({}, slide);
        }
        catch (err) {
            console.log(err);
        }
    }
    /*submit a new slide*/
    submitSlide(slide) {
        /* modify slide*/
        if (slide.index < this.curSlideIndex) {
            this.slider.slides[slide.index - 1] = Object.assign({}, slide);
            console.log("slide existing");
        }
        /* create new slide*/
        else {
            this.curSlideIndex++;
            let s: Slide = Object.assign({}, slide);
            s.index = this.curSlideIndex;
            this.slider.slides.push(s);
            console.log("slide new");
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
                        if (s.index > index - 1)
                            s.index--;
                    }
                )
                this.curSlideIndex--;
                console.log("slide deleted in local");
            }
            this.validService.changeSlideValid(true,index,"DELETE");
        }
        catch (err) {
            console.log("slide cannot be deleted");
        }
    }
    /* check creator valid*/
    checkCreator(index): boolean {
        let creator = this._creatorEle.toArray();
        let valid = true;
        console.log(creator);
        creator.forEach(c => {
            if (!c.form.valid&&c.slideIndex!=index) valid = false
        })
        return valid;
    }
    /*change slide order*/
    shuffleSlide() {
        //save new order
        if (this.isInShuffle) {
            let slides = Object.assign({}, this.slider.slides);;
            this.shuffleOrder.forEach((order, i) => {
                this.slider.slides[i] = slides[order];
                this.slider.slides[i].index = i + 1;
            })
            console.log("after shuffle save", this.slider.slides);
            this.isInShuffle = false;
        }
        //start to shuffle
        else {
            this.shuffleOrder = [];
            this.slider.slides.forEach((s, i) => {
                this.shuffleOrder.push(i);
            })

            this.isInShuffle = true;
        }

    }
    /* clear change of shuffle*/
    clearShuffle() {
        this.isInShuffle = false;
        let t_slides = this.slider.slides;
        /*  t_slides.forEach((s) => {
              this.slider.slides[s.index-1]=s;
          })*/
        console.log("clear shuffle", this.slider);
    }
}
