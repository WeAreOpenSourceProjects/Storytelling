
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import { Router } from '@angular/router';
import {SlidesService} from '../../services/slides.service';
import {Slides} from '../../models/slides';
import {Slide} from '../../models/slide';
@Component({
    selector: 'app-slides-creator',
    templateUrl: './slides-creator.component.html',
    styleUrls: ['./slides-creator.component.scss'],
    providers: [SlidesService]
})
export class SlidesCreatorComponent implements OnInit {

    isValidated: boolean=false;
    slider: Slides; // the whole slides
    slides: Array<Slide> = [];  //the slides pages
    curSlideIndex: number = 1;// the slide that will be created
    constructor(private router: Router, private sanitizer: DomSanitizer, private slidesService: SlidesService) {
    }

    ngOnInit() {
        this.slider = new Slides();
        this.curSlideIndex = 1;
    }
    /*  private _buildForm() {
          return this._fb.group({
              title: new FormControl('', Validators.required),
              description: new FormControl('', Validators.nullValidator),
              tag: new FormControl('', Validators.nullValidator)
          });
      }*/
    /* trigger when slides setting change*/
    slidesSettingChange(setting){
        this.slider.slidesSetting=setting;
    }
    /* validate submit*/
    validateSubmit(){
      this.isValidated=true;
    }
    /*add a new slide*/
    submitSlide(slide) {
        /* modify slide*/
        if (slide.index < this.curSlideIndex) {
            this.slides[slide.index - 1] = Object.assign({}, slide);
            console.log("slide existing");
        }
        /* create new slide*/
        else {
            this.curSlideIndex++;
            let s: Slide = Object.assign({}, slide);
            s.index = this.curSlideIndex;
            this.slides.push(s);
            console.log("slide new");
        }



    }
    /*create a new slides*/
    createSlides() {
        this.slider.slides = this.slides;
        console.log("slider creating..", this.slider);
        //console.log(this.router);
        this.slidesService.submitSlides(this.slider)
            .subscribe(
            data => {
                console.log("created");
                //this.router.navigate(['/login']);
                this.router.navigate(['/slides']);
            },
            error => {
                console.log("fail to createSlides");
            });
    }
}
