import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {SlidesService} from '../../services/slides.service';
import { Slides} from '../../models/slides';
@Component({
    selector: 'app-slides-editor',
    templateUrl: './slides-editor.component.html',
    styleUrls: ['./slides-editor.component.scss']
})
export class SlidesEditorComponent implements OnInit {
    slider: Slides = new Slides();
    isValidated: boolean = false;
    constructor(private slidesService: SlidesService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        let id;
        this.route.params.subscribe(params => {
            id = params['id'];
        });
        this.slidesService.getSlides(id)
            .subscribe(
            slides => {
                console.log("get slider");
                this.slider = slides;
            },
            error => {
                console.log("fail to get slides data");
            });
    }

    slidesSettingChange(setting) {
        this.slider.slidesSetting = setting;
    }
    validateSubmit() {
        this.isValidated = true;
    }
    saveSlide(slide) {
        try {
            this.slider.slides[slide.index - 1] = Object.assign({}, slide);
        }
        catch (err) {
            console.log(err);
        }
    }
    saveSlides() {
        this.slidesService.updateSlide(this.slider, this.slider._id)
            .subscribe(res => {
                console.log("update succesfully");
                this.router.navigate(['/slides']);
            },
            error => console.log(error));
    }
}
