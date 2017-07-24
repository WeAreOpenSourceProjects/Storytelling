import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray  } from '@angular/forms';
import {ValidService} from '../../../../services/valid.service';
import { environment } from '../../../../../../environments/environment';
import * as slideOption from './slideOption';

import { Slide } from '../../../../models/slide';

@Component({
    selector: 'app-slide',
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.scss'],
    providers: []
})

export class SlideComponent implements OnInit, OnChanges {

    @Output() confirmSlideOpt: EventEmitter<Object> = new EventEmitter();
    @Output() deleteSlideOpt: EventEmitter<number> = new EventEmitter();
    @Input() slideIndex: number;
    @Input() slideSetting: Slide;
    @Input() slideOpendIndex: number;
    @Output() openSlideIndex: EventEmitter<number> = new EventEmitter();

    showForm= true; // indicator for showing slide setting
    @Input() isInShuffle: boolean;
    slide: Slide = new Slide();
    form: FormGroup =  this._buildForm();
    graphs: Array<any>;
    pageLayout: Array<any>;
    titleAlign: Array<string>;
    dataBuilder: any = {};
    editorOptions: Object;
    @ViewChild('dataInput') dataInputTab;
    @ViewChild('graphSelector') graphSelector;
    csvJson: any = [];
    curTab = 0;
    constructor(private _fb: FormBuilder, private validService: ValidService) {

    }

    ngOnInit() {
        if (!this.slide.pageTitle.title) {
            this.slide.pageTitle.title = '';
        }
        this.titleAlign = slideOption.titleAlign;
        this.graphs = slideOption.graphType;
        this.pageLayout = slideOption.pageLayoutOption;
        // set server path
        let baseURL = `${environment.backend.protocol}://${environment.backend.host}`;
        if (environment.backend.port) {
            baseURL += `:${environment.backend.port}`;
        };
        this.editorOptions = {
            heightMin: 200,
            heightMax: 400,
            charCounterMax: 1000,
            toolbarSticky: false,
            imageUploadURL: `${baseURL}${environment.backend.endpoints.imagesServer}`,
            imageManagerLoadURL: `${baseURL}${environment.backend.endpoints.imagesServer}`
        };
    }

    ngOnChanges() {

        if (this.slideSetting) {
            this.slide = this.slideSetting;
        }
        if (this.slideIndex) {
            this.slide.index = this.slideIndex;
        }
        this.form = this._buildForm();
        this.validService.changeSlideValid(this.form.valid, this.slideIndex);
        this.form.valueChanges.subscribe(data => {
            this.validService.changeSlideValid(this.form.valid, this.slideIndex);
        });
        this.graphChanged();
        this.showForm = this.slideIndex === this.slideOpendIndex;
    }
    private _buildForm() {
        return this._fb.group({
            pageTitle: new FormControl(this.slide.pageTitle.title, Validators.nullValidator),
            titleAlign: new FormControl(this.slide.pageTitle.align, Validators.nullValidator),
            slideText: new FormControl(this.slide.text, Validators.nullValidator),
            slideGraph: new FormControl(this.slide.graph, Validators.nullValidator),
            graphData: this._fb.array([
                this.initData(),
            ])
        });
    }
    /* toggle the slideSetting*/
    toggleForm() {
        this.slideOpendIndex = null;
        this.showForm = !this.showForm;
        if (this.showForm) {
            this.openSlideIndex.emit(this.slideIndex);
        }
    }
    validChildForm(isValid) {
        this.validService.changeSlideValid(isValid, this.slideIndex);
    }

    confirmSlide(isValid) {
        /* to decide which data to take from tab*/
        if (this.slide.hasGraph) {
            if (this.dataBuilder.chartOptions.chartType
                && this.dataBuilder.chartOptions.chartType.cmpName != null) {
                this.slide.graph = this.dataBuilder.chartOptions.chartType.cmpName;
            } else {
                this.slide.graph = 'ngGraph';
            }
            this.slide.data = this.dataBuilder.data;
            this.slide.config = this.dataBuilder.chartOptions;
        } else {
            this.slide.graph = 'noGraph';
        }
        if (!this.slide.hasText) {
            this.slide.text = '';
        }
        if (this.slideIndex) {
            this.slide.index = this.slideIndex;
        }
        this.slide.pageTitle.title = this.form.value.pageTitle;
        this.slide.pageTitle.align = this.form.value.titleAlign;
        this.csvJson = [];
    }

    confirmeSlideGRaphConfig(data) {
        this.dataBuilder.data = data.data;
        this.dataBuilder.chartOptions = data.chartOptions;
    }

    deleteSlide(e) {
        this.deleteSlideOpt.emit(this.slideIndex);
    }
    initData() {
        let dataForm = {
            index: [''],
            value: ['', Validators.pattern('^[0-9]*$')]
        };
        return this._fb.group(dataForm);
    }
    addData() {
        const control = <FormArray>this.form.controls['graphData'];
        control.push(this.initData());
    }
    /* when change graph*/
    graphChanged() {
        // change json sample
        // if the slide data is already set
        if (this.slide.data !== undefined) {
            if (this.slide.data.length && this.form.value.slideGraph == this.slide.graph) {
                // if has data, set tab to json
                this.curTab = 0;
                let data = { 'graphData': this.slide.data };
                return;
            }
        }
    }
    pageLayoutChange(value) {
        switch (value) {
            case 'FullScreenGraph':
                this.slide.hasGraph = true;
                this.slide.hasText = false;
                break;
            case 'textInCenter': this.slide.hasGraph = false; this.slide.hasText = true; break;
            case 'textInCenterImageBackground': this.slide.hasGraph = false; this.slide.hasText = true; break;
            case 'LeftGraphRightText': this.slide.hasGraph = true; this.slide.hasText = true; break;
            case 'LeftTextRightGraph': this.slide.hasGraph = true; this.slide.hasText = true; break;
            default: break;
        }
        this.slide.pageLayout = value;
    }
    textAlignChange(value) {
        this.slide.textVerAlign = value;
    }
    /* image background*/
    setImageHtml(image) {
        this.slide.slideImage = image;
    }
    /* sort and group series of json data*/
    sortSeries(data) {
        let newJson = [];
        let series = [];
        let isInSeries = (name) => {
            let index = -1;
            for (let i = 0; i < series.length; i++) {

                if (name === series[i]) {
                    index = i;
                    break;
                }
            }
            return index;
        };
        data.forEach(obj => {
            const seriesIndex = isInSeries(obj['series']);
            if (seriesIndex !== -1) {
                /* add to series */
                newJson[seriesIndex].push(obj);
            } else {
                /* create new series */
                series.push(obj['series']);
                const newSeries: Array<any> = [];
                newSeries.push(obj);
                newJson.push(newSeries);
            }
        });
        return newJson;
    }
}


