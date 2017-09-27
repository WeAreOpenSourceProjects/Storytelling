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
    providers: [DragulaService],
    encapsulation: ViewEncapsulation.None
})
export class SlidesEditorComponent implements OnChanges {

    slider: Slides = new Slides(); // the whole slides
    curSlideIndex = 1; // the slide that will be created(the amounts of slides pages +1 )
    isValidated = false;
    isValidatedSlide = true;
    isValidatedSetting = false;


    slideOpendIndex: number;

    @Input() sliderIpt: Slides;
    @Output() submit = new EventEmitter();
    @Output() bannerImageUpload = new EventEmitter();
    @Output() slideDeleted =  new EventEmitter();
    @Output() errorsHandle =  new EventEmitter();
    @Output() onShuffle = new EventEmitter();
    constructor(private dragulaService: DragulaService, private validService: ValidService, private notifBarService: NotifBarService) {
        dragulaService.setOptions('shuffle-bag', {
            moves: (el, source, handle, sibling) => !(this.slideOpendIndex != null && this.slideOpendIndex > 0)
        });
        dragulaService.drag.subscribe((value) => {
            console.log(`drag: ${value[0]}`);
            this.onShuffle.emit(true);
        });
        dragulaService.out.subscribe((value) => {
            console.log(`drop: ${value[0]}`);
            this.onShuffle.emit(false);
        });
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
        this.validService.changeSlideValid(false, this.curSlideIndex - 1);
        this.checkValid();
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
            this.slideDeleted.emit(this.curSlideIndex);
        } catch (err) {
            this.notifBarService.showNotif('delete fail : ' + err);
        }
    }
    saveSlide(result) {
        this.errorsHandle.emit(result);
    }
}
