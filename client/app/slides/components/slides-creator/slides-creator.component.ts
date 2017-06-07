

import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';
import { Router } from '@angular/router';
import {SlidesService} from '../../services/slides.service';
import {ValidService} from '../../services/valid.service';
import {Slides} from '../../models/slides';
import {Slide} from '../../models/slide';
import { EditorComponent} from '../editor/editor.component';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-slides-creator',
    templateUrl: './slides-creator.component.html',
    styleUrls: ['./slides-creator.component.scss'],
    providers: [SlidesService, ValidService]
})
export class SlidesCreatorComponent implements OnInit, AfterViewChecked {

    isValidated: Boolean = false;
    slider: Slides; // the whole slides
    @ViewChild('editor') _editor: EditorComponent;
    editorValid: Subscription;
    constructor(private router: Router, private sanitizer: DomSanitizer, private slidesService: SlidesService, private validService: ValidService,
        private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.slider = new Slides();
        this.editorValid = this.validService.validAll$.subscribe(
            valid => {
               if (valid)
                    this.isValidated = true;
               else this.isValidated = false;
                //  this.cdRef.detectChanges();
            });
    }
    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }
    /* validate status change*/
    formValidateChange(status) {
        console.log('creator detect status;', status);
        this.isValidated = status;
    }
    /*create a new slides*/
    createSlides() {
        this.slider = this._editor.slider;
        this.editorValid = this.slidesService.submitSlides(this.slider)
            .subscribe(
                data => {
                    console.log('created');
                    // this.router.navigate(['/login']);
                    this.router.navigate(['/slides']);
                },
                error => {
                    console.log('fail to createSlides');
                });
    };

}
