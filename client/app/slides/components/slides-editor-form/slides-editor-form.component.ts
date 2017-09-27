import {Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, OnChanges} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { SlidesService } from '../../services/slides.service';
import { ValidService } from '../../services/valid.service';
import { Slides } from '../../models/slides';
import { SlidesEditorComponent} from './slides-editor/slides-editor.component';
import {NotifBarService} from 'app/core';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
    selector: 'app-slides-editor-form',
    templateUrl: './slides-editor-form.component.html',
    styleUrls: ['./slides-editor-form.component.scss'],
    providers: [SlidesService, ValidService]
})

export class SlidesEditorFormComponent implements OnInit, AfterViewChecked {

    private id: string;//slides id in database
    private slider: Slides = new Slides();//corresponding slides
    private editorValid: Subscription; //validation of slide editor
    private errorMsg;//error
    private mode = '';//SAVE mode or CREATE mode
    private isRequired = false;
    private isInShuffle = false;
     loading = true;
    @ViewChild('editor') _editor: SlidesEditorComponent;

    constructor(private router: Router,
        private slidesService: SlidesService,
        private validService: ValidService,
        private route: ActivatedRoute,
        private notifBarService: NotifBarService,
        private cdRef: ChangeDetectorRef) {
        this.id = null;
        this.slider = new Slides();
        this.errorMsg = [];
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.id = params['id'];
            }
        });
        if (this.id) {
            this.mode = 'SAVE';
            this.slidesService.getSlides(this.id)
                .subscribe(
                slides => {
                    this.slider = slides;
                },
                error => {
                    this.notifBarService.showNotif('fail to load slides users-list. error is ' + error);
                }, () => this.loading = false);
        } else {
            this.mode = 'CREATE';
            this.slider = new Slides();
            this.loading = false;
        }

        this.editorValid = this.validService.validAll$.subscribe(
            valid => {
                this.isRequired = valid['msg'][0];
                this.errorMsg = [];
                if (this.isRequired) this.errorMsg.push({msg : valid['msg'], index: -1});
                this.slider.slides.forEach((slide, index) => !slide.isValid ? this.errorMsg.push({msg : 'Slide ' + (index+1) + ' is not finished', index : index + 1} ) : false);
            });
    }

    // TODO rework service, rename in presentatiion
    errorsHandle(currentSlide) {
        if (currentSlide.isValid) {
            this.errorMsg = [];
            this.slider.slides.forEach((slide, index) => !slide.isValid ? this.errorMsg.push({msg :'Slide ' + (index + 1) + ' is not finished', index : index+1} ) : false);
        }
    }

    saveSlides(id) {
        if (id) {
            this.slidesService.updateSlide(this.slider, this.slider._id)
                .subscribe(
                () => {
                    this.notifBarService.showNotif('your changes in slides has been saved.');
                    this.router.navigate(['/slides']);
                },
                error => this.notifBarService.showNotif('fail to save your changes. the error is ' + error));
        } else {
            this.slider = this._editor.slider;
            this.editorValid = this.slidesService.submitSlides(this.slider)
                .subscribe(
                () => {
                    this.notifBarService.showNotif('create slides successfully!');
                    this.router.navigate(['/slides']);
                },
                error => {
                    this.notifBarService.showNotif('fail to create slides. the error is ' + error);
                });
        }
    }
    slideDeleted(index){
        this.errorMsg.forEach((arrayMsg, i) => {
         if (arrayMsg.index === index){
             this.errorMsg.splice(i, 1);
         }
        });
    }

    onShuffle(shuffle) {
        this.isInShuffle = shuffle;
        if (!shuffle) {
            this.errorMsg = [];
            this.slider.slides.forEach((slides, index) =>
                !slides.isValid ?
                    this.errorMsg.push({msg: 'Slide ' + (index + 1) + ' is not finished', index: index + 1})
                    : false);
        };
    }
}
