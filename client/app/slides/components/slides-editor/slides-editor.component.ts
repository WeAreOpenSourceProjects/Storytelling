import { Component, OnInit, Output, ViewChild,AfterViewChecked,ChangeDetectorRef } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent} from '../editor/editor.component'
import {SlidesService} from '../../services/slides.service';
import {ValidService} from '../../services/valid.service';
import { Slides} from '../../models/slides';
@Component({
    selector: 'app-slides-editor',
    templateUrl: './slides-editor.component.html',
    styleUrls: ['./slides-editor.component.scss'],
    providers: [SlidesService, ValidService]
})
export class SlidesEditorComponent implements OnInit, AfterViewChecked {
    slider: Slides = new Slides();

    isValidated: boolean = false;
    editorValid: Subscription;
    @ViewChild("editor") _editor: EditorComponent;
    constructor(private slidesService: SlidesService, private validService: ValidService,     private cdRef: ChangeDetectorRef, private router: Router, private route: ActivatedRoute) { }


    ngOnInit() {
        let id;
        this.route.params.subscribe(params => {
            id = params['id'];
        });
        this.slidesService.getSlides(id)
            .subscribe(
            slides => {
                console.log("get slider",slides);
                this.slider = slides;
            },
            error => {
                console.log("fail to get slides data");
            });
        this.editorValid=this.validService.validAll$.subscribe(
            valid =>{
                if (valid)
                    this.isValidated = true;
                else this.isValidated = false;
                //  this.cdRef.detectChanges();
            })
    }
    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }
    saveSlides() {

        console.log("save",this.slider)
        this.slidesService.updateSlide(this.slider, this.slider._id)
            .subscribe(res => {
                console.log("update succesfully");
                this.router.navigate(['/slides']);
            },
            error => console.log(error));
    }

}
