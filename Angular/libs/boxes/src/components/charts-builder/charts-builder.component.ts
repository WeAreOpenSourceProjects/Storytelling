import { Component, OnInit, ViewChild, Input,ViewContainerRef,  Output, EventEmitter, DoCheck, ChangeDetectionStrategy } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import * as shape from 'd3-shape';
import * as babyparse from 'babyparse';
import * as _ from 'lodash';
import { MatDialogRef } from '@angular/material';
import { chartTypes } from './chartTypes';
import { gapminder } from './data';
import { GraphComponent } from '@labdat/charts'
const defaultOptions = {
  view: [900, 600],
  colorScheme: colorSets.find(s => s.name === 'cool'),
  schemeType: 'ordinal',
  showLegend: true,
  legendTitle: 'Legend',
  gradient: false,
  showXAxis: true,
  showYAxis: true,
  showXAxisLabel: true,
  showYAxisLabel: true,
  yAxisLabel: '',
  xAxisLabel: '',
  autoScale: true,
  showGridLines: true,
  rangeFillOpacity: 0.5,
  roundDomains: false,
  tooltipDisabled: false,
  showSeriesOnHover: true,
  curve: shape.curveLinear,
  curveClosed: shape.curveCardinalClosed
};

@Component({
  selector: 'app-chart-builder',
  templateUrl: './charts-builder.component.html',
  styleUrls: ['./charts-builder.component.scss']
})
export class ChartsBuilderComponent implements OnInit, DoCheck {
  @Input() inputData: any[];
  @Input() inputOptions: any;
  @Output() validSlide = new EventEmitter();
  @Output() validForm = new EventEmitter();
  @ViewChild('viz', { read: ViewContainerRef }) viz: ViewContainerRef;


  chartTypes = chartTypes;

  config = {
    lineNumbers: true,
    theme: 'dracula',
    mode: 'htmlmixed'
  };
  constructor(public dialogRef: MatDialogRef<ChartsBuilderComponent>) {}


  formatTable: boolean = false;
  data: any[];
  rawData: any[];
  headerValues: any[];
  errors: any[];
  chartType: any;
  theme: string;
  dataDims: string[][];
  chartOptions: any;
  firstFormGroup: FormGroup;
  width : number;
  height:  number;

  @Output() configGraph = new EventEmitter();
  warnMsg: string; //to tell the user which part isn't validated
  _dataText: string;
  get dataText() {
    return this._dataText || ' ';
  }

  set dataText(value) {
    this.updateData(value);
  }

  get hasValidData() {
    return this._dataText && this._dataText.length > 0 && this.errors.length === 0;
  }

  get hasChartSelected() {
    return this.hasValidData && this.chartType && this.chartType.name;
  }

  get hasValidBuilder() {
    return (
      this.hasChartSelected &&
      this.hasValidDim &&
      !this.chartType.dimLabels.some((l, i) => (l ? !(this.dataDims[i] && this.dataDims[i].length > 0) : false))
    );
  }
  get isValidSlide() {
    if (!this.hasValidData) {
      this.warnMsg = 'the input data is not validated';
    } else if (!this.hasChartSelected) {
      this.warnMsg = 'please select chart type';
    } else if (!this.hasValidBuilder) {
      this.warnMsg = 'unvalid dimensions';
    }
    return (
      (this.hasValidBuilder == undefined ? false : this.hasValidBuilder) &&
      (this.hasChartSelected == undefined ? false : this.hasChartSelected) &&
      (this.hasValidData == undefined ? false : this.hasValidData)
    );
  }
  get hasValidDim() {
    if (this.dataDims == null || this.dataDims == undefined) return true;
    let valid = true;
    this.dataDims.forEach(dim => {
      if (dim != null)
        dim.forEach(d => {
          console.log(d);
          if (d.split(' ')[0] == 'err') valid = false;
        });
    });
    return valid;
  }

  editorConfig = {
    lineNumbers: true,
    theme: 'white',
    mode: {
      name: 'json'
    },
    htmlMode: true
  };
  allowDropFunction(size: number, dimIndex: number): any {
    return (dragData: any) => this.dataDims[dimIndex] == null || this.dataDims[dimIndex].length < size;
  }

  addTobox1Items(dimIndex: number, $event: any) {
    let type = this.headerValues.find(h => h.title == $event.dragData)['type'];
    let valid = false;
    this.chartType.dimLabels[dimIndex].dataType.forEach(_type => {
      if (_type == type) valid = true;
    });
    if (this.dataDims[dimIndex] == null) this.dataDims[dimIndex] = [];
    if (valid) {
      this.dataDims[dimIndex].push($event.dragData);
      this.processData();
    } else {
      this.dataDims[dimIndex].push('err' + ' ' + $event.dragData);
    }
  }

  removeItem(dimIndex: number, item: string) {
    if (this.dataDims[dimIndex] == null) return;
    _.remove(this.dataDims[dimIndex], col => col === item);
    this.processData();
  }

  ngOnInit() {
    this.warnMsg = '';
    if (this.inputData != null) {
      this.loadData();
    } else {
      this.clearAll();
    }
  }
  ngOnChanges(){
    console.log('change')
  }
  ngDoCheck() {
    if(!this.isValidSlide){

    }
  }
  editData(updatedData) {
    this._dataText = babyparse.unparse(updatedData);
    this.rawData = updatedData;
    this.processData();
  }
  changeFormat() {
    this.formatTable = !this.formatTable;
  }
  loadData() {
    if (this.inputOptions) {
      this.headerValues = this.inputOptions.headerValues;
      this.dataDims = this.inputOptions.dataDims;
      this.rawData = this.inputData;
      this.errors = []
      this.chartOptions = this.inputOptions ;
      this._dataText = babyparse.unparse(this.inputData);
      this.chartType = this.chartTypes.find(chart => chart.name === this.inputOptions.chartType.name);

      this.processData();
    }
  }

  useExample() {
    this.clear();
    this.dataText = gapminder;
  }
  usePast() {
    console.log('clear here')
    this.clearAll();
  }

  useExampleDimension() {
    this.dataDims = this.chartType.dimExemple;
    this.processData();
  }
  clear() {
    this.headerValues = [];
    this.rawData = [];
    this.dataDims = [null, null, null, null];
    return (this.data = []);
  }

  clearAll() {
    this.clear();
    this.dataText = '';
    this.chartType = null;
    this.theme = 'light';
    this.chartOptions = { ...defaultOptions };
  }
  choseChartType(chart) {
    this.chartType = chart;
    this.dataDims = [null, null, null, null];
    this.processData();
  }
  processData() {
    if (!this.hasValidBuilder) {
      return;
    }
    this.data = this.chartType.convertData(this.dataDims, this.rawData);
    this.configGraph.emit({
      data: this.rawData,
      chartOptions: {
        chartType: this.chartType,
        headerValues: this.headerValues,
        dataDims: this.dataDims,
        ...this.chartOptions
      }
    });

    if (this.isValidSlide) {
      this.validSlide.emit('this slid is valid');
    }
    return this.data;
  }

  updateData(value = this._dataText) {
    this._dataText = value;
    const parsed = babyparse.parse(this._dataText, {
      header: true,
      dynamicTyping: true
    });

    console.log(
      'parsed',
      parsed,
      parsed.meta.fields.map(key => ({ data: key, title: key.charAt(0).toUpperCase() + key.slice(1) }))
    );

    this.errors = parsed.errors;

    if (this.errors.length) {
      return this.clear();
    }

    this.rawData = parsed.data;
    /*
    const headerValues = parsed.meta.fields.map(d => ({
        name: d,
        type: typeof parsed.data[0][d]
    }));
*/
    const headerValues = parsed.meta.fields.map(key => ({
      data: key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      type: typeof parsed.data[0][key]
    }));

    if (JSON.stringify(headerValues) !== JSON.stringify(this.headerValues)) {
      this.headerValues = headerValues.slice();
      this.dataDims = [null, null, null, null];
      this.data = [];
    } else {
      this.processData();
    }
  }
}
