import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnChanges  } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray  } from '@angular/forms';
import {ValidService} from '../../../services/valid.service';
import {JsonValidator } from '../json-validator';

import *  as sampleData from './data';


import { Slide } from '../../../models/slide';
@Component({
    selector: 'app-slide-creator',
    templateUrl: './slide-creator.component.html',
    styleUrls: ['./slide-creator.component.scss'],
    providers: []
})
export class SlideCreatorComponent implements OnInit, AfterViewInit, OnChanges {
    @Output() confirmSlideOpt: EventEmitter<Object> = new EventEmitter();
    @Output() deleteSlideOpt: EventEmitter<number> = new EventEmitter();
    @Input() slideIndex: number;
    @Input() slideSetting: Slide;
    showForm: boolean = true; //indicator for showing slide setting
    @Input() isInShuffle: boolean;
    slide: Slide = new Slide();
    form: FormGroup;
    graphs: Array<any> = [
        {
            value: "barChart",
            type: "Bar Chart"
        }, {
            value: "forceDirectedGraph",
            type: "Force Directed Graph"
        }, {
            value: "pieChart",
            type: "Pie chart"
        },
        {
            value: "HierarchicalEdgeBundling",
            type: "Hierarchical edge bundling"
        },
        {
            value: "lineChart",
            type: "Line Chart"
        },
        {
            value: "advancedPieChart",
            type: "Advanced Pie Chart"
        },
        {
            value: "gaugeChart",
            type: "Gauge Chart"
        },
        {
            value: "treemapChart",
            type: "Treemap Chart"
        },
        {
            value: "sunburstChart",
            type: "Sunburst Chart"
        },
        /* hide image part
      {
          value: "image",
          type: "Image"
      },
      */
        {
            value: "noGraph",
            type: "No Graph"
        }];
    pageLayout: Array<any> = [
        {
            value: "FullScreenGraph",
            type: "Full Screen Graph"
        }, {
            value: "textInCenter",
            type: "Text in Center"
        },
        /* hide image part
        {
            value: "textInCenterImageBackground",
            type: "Text in Center + Image Background"
        },
        */
        {
            value: "LeftGraphRightText",
            type: "Graph on Left +  Text on Right"
        },
        {
            value: "LeftTextRightGraph",
            type: "Text on Left +  Graph on Right"
        }
    ];
    dataExample: string = '{}';
    editorOptions: Object = {
        heightMin: 200,
        heightMax: 400,
        charCounterMax: 1000,
        imageUploadURL: 'http://127.0.0.1:3000/api/imagesServer',
        imageManagerLoadURL: 'http://127.0.0.1:3000/api/imagesServer'
    }
    @ViewChild("dataInput") dataInputTab;
    @ViewChild("graphSelector") graphSelector;
    csvJson: any = [];
    curTab: number = 0;
    constructor(
        private _fb: FormBuilder,
        private validService: ValidService
    ) {

    }

    ngOnInit() {


    }
    ngAfterViewInit() {

    }
    ngOnChanges() {
        if (this.slideSetting) {
            this.slide = this.slideSetting;

        }
        if (this.slideIndex) {

            this.slide.index = this.slideIndex;
        }
        this.form = this._buildForm(); this.validService.changeSlideValid(this.form.valid, this.slideIndex);
        this.form.valueChanges.subscribe(data => {
            this.validService.changeSlideValid(this.form.valid, this.slideIndex);
        })
        this.initJson();
        this.showForm = !this.form.valid;
    }
    private _buildForm() {
        return this._fb.group({
            slideText: new FormControl(this.slide.text, Validators.nullValidator),
            slideGraph: new FormControl(this.slide.graph, Validators.nullValidator),
            pageLayout: new FormControl(this.slide.pageLayout, Validators.required),
            graphDataJson: new FormControl(this.dataExample, Validators.compose([JsonValidator()])),
            graphData: this._fb.array([
                this.initData(),
            ])
        });
    }
    /* toggle the slideSetting*/
    toggleForm() {
        this.showForm = !this.showForm;
    }
    confirmSlide() {
        /* to decide which data to take from tab*/

        if (this.slide.hasGraph && !(this.form.value.slideGraph == 'noGraph' || this.form.value.slideGraph == 'image')) {
            switch (this.dataInputTab.selectedIndex) {
                //json input
                case 0: {
                    let data;
                    try {
                        data = JSON.parse(this.form.value.graphDataJson);
                        console.log("data here", this.form.value.graphDataJson);
                        this.slide.data = data.graphData;
                    }
                    catch (e) {
                        console.log("data format invalidate!!!!!");
                    }
                    break;
                }
                //csv input
                case 1: {
                    let data;
                    try {
                        //data = JSON.parse(this.csvJson);
                        //console.log(data);
                        this.slide.data = this.csvJson;
                    }
                    catch (e) {
                        console.log("data format iImageBackgroundnvalidate!!!!!");
                    }

                    break;
                }
                default: this.slide.data = '';
            }
        }
        if (this.slide.hasGraph)
            this.slide.graph = this.form.value.slideGraph;
        else this.slide.graph = "";
        this.slide.pageLayout = this.form.value.pageLayout;
        if (this.slide.hasText)
            this.slide.text = this.form.value.slideText;
        else this.slide.text = "";
        if (this.slideIndex) {
            this.slide.index = this.slideIndex;
        }
        console.log('slide 1 confirme: ', this.slide);
        this.confirmSlideOpt.emit(this.slide);
        this.slide = new Slide();

        this.csvJson = [];
        this.form = this._buildForm();

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
        console.log(this.form.value);
    }
    initJson() {
        //change json sample

        //the slide data is already set
        if (this.slide.data != undefined) {
            if (this.slide.data.length && this.form.value.slideGraph == this.slide.graph) {
              //if has data, set tab to json
                this.curTab = 0;
                let data = { "graphData": this.slide.data };
                console.log(data);
                this.form.controls['graphDataJson'].setValue(JSON.stringify(data));
                return;
            }
        }
        // the slide data has not been set
        switch (this.form.value.slideGraph) {
            case "barChart": this.form.controls['graphDataJson'].setValue(barCharDataExample); break;
            case "gaugeChart": this.form.controls['graphDataJson'].setValue(ngxSingleChartDataExample); break;
            case "advancedPieChart": this.form.controls['graphDataJson'].setValue(ngxSingleChartDataExample); break;
            case "forceDirectedGraph": this.form.controls['graphDataJson'].setValue(forceDirectedGraphDataExample); break;
            case "lineChart": this.form.controls['graphDataJson'].setValue(lineChartExample); break;
            case "treemapChart": this.form.controls['graphDataJson'].setValue(treemapChartExample); break;
            case "pieChart": this.form.controls['graphDataJson'].setValue(pieChartExample); break;
            case "sunburstChart": this.form.controls['graphDataJson'].setValue(sunburstChartExample); break;
            case "HierarchicalEdgeBundling": this.form.controls['graphDataJson'].setValue(HierarchicalEdgeExample); break;

            default: ;
        }

    }
    pageLayoutChange() {
        switch (this.form.value.pageLayout) {
            case "FullScreenGraph":
                this.slide.hasGraph = true;
                this.slide.hasText = false;
                break;
            case "textInCenter": this.slide.hasGraph = false; this.slide.hasText = true; break;
            case "textInCenterImageBackground": this.slide.hasGraph = true; this.slide.hasText = true; break;
            case "LeftGraphRightText": this.slide.hasGraph = true; this.slide.hasText = true; break;
            case "LeftTextRightGraph": this.slide.hasGraph = true; this.slide.hasText = true; break;
            default: ;
        }
    }
    getCsvJson(json) {
        try {
            console.log(json);
            let j = json;
            //for the chars has many series
            if (this.form.value.slideGraph == "lineChart") {
                this.csvJson = this.sortSeries(json);
                //this.csvJson.push(j)
            }
            else this.csvJson = j;
        }
        catch (e) {
            console.error("unvalidate json");
        }
    }
    /* image background*/
    setImageHtml(path) {
        console.log("image html");
        this.slide.fullScreenHtml = "<img src='" + path + "' style='width:100%;height:100%'>";
    }
    /* sort and group series of json data*/
    sortSeries(data) {
        let newJson = [];
        let series = [];
        let isInSeries = (name) => {
            let index = -1;
            for (let i = 0; i < series.length; i++) {

                if (name == series[i]) {
                    index = i;
                    break;
                }
            }
            return index;
        };
        data.forEach(obj => {
            let seriesIndex = isInSeries(obj["series"]);
            if (seriesIndex != -1) {
                newJson[seriesIndex].push(obj)
                console.log("add to series", obj["series"]);
            }
            else {
                series.push(obj["series"])
                console.log(series);
                let newSeries: Array<any> = [];
                newSeries.push(obj);
                newJson.push(newSeries);
                console.log("create new series", obj["series"]);
            }
        })
        console.log(newJson);
        return newJson;
    }



}

const ngxSingleChartDataExample = JSON.stringify(sampleData.single);
const barCharDataExample =JSON.stringify(sampleData.barCharData);
const forceDirectedGraphDataExample = JSON.stringify(sampleData.forceDirectedGraphData);
const lineChartExample = JSON.stringify(sampleData.lineChartData);
const pieChartExample =JSON.stringify(sampleData.pieChartData);

const HierarchicalEdgeExample = JSON.stringify(sampleData.HierarchicalEdgeData);
const treemapChartExample =JSON.stringify(sampleData.treemapChartData);
const sunburstChartExample = JSON.stringify(sampleData.sunburstChartData);
