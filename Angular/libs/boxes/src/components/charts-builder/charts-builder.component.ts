import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ViewContainerRef,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import * as shape from 'd3-shape';
import * as babyparse from 'babyparse';
import * as _ from 'lodash';
import { MatDialogRef } from '@angular/material/dialog';
import { chartTypes } from './chartTypes';
import { gapminder } from './data';
import { GraphComponent } from '@labdat/charts';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-chart-builder',
  templateUrl: './charts-builder.component.html',
  styleUrls: ['./charts-builder.component.scss']
})
export class ChartsBuilderComponent implements OnInit {
  @Input() inputData: any[];
  @Input() inputOptions: any;

  chartTypes = chartTypes;
  constructor(public dialogRef: MatDialogRef<ChartsBuilderComponent>, private changeDetector: ChangeDetectorRef) {}

  useOurSamples = false;
  formatTable: boolean = false;
  sampleUsed = '';
  data: any[];
  rawData: any[];
  headerValues: any[];
  headerValuesForTable: any[];
  errors: any[];
  chartType: any;
  theme: string;
  dataDims: string[][];
  chartOptions: any;
  firstFormGroup: FormGroup;
  width: number;
  height: number;

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
          if (d.split(' ')[0] == 'err') valid = false;
        });
    });
    return valid;
  }

  allowDropFunction(size: number, dimIndex: number): any {
    return (dragData: any) => this.dataDims[dimIndex] == null || this.dataDims[dimIndex].length < size;
  }

  addTobox1Items(dimIndex: number, $event: any) {
    let type = this.headerValues.find(h => h.data == $event.dragData)['type'];
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
    if (this.inputData != null) {
      this.loadData();
    } else {
      this.clearAll();
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
      this.errors = [];
      this.chartOptions = this.inputOptions;
      this._dataText = babyparse.unparse(this.inputData);
      this.chartType = this.chartTypes.find(chart => chart.name === this.inputOptions.chartType.name);
      this.processData();
    }
  }

  importCsv(files: FileList) {
    if (files && files.length > 0) {
      let file: File = files.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = e => {
        this.clear();
        var arrayBuffer = reader.result;
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join('');
        var workbook = XLSX.read(bstr, { type: 'binary' });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        //this.dataText = XLSX.utils.sheet_to_csv(worksheet).trim();
        this.updateData(XLSX.utils.sheet_to_csv(worksheet).trim());
      };
    }
  }

  trySamples() {
    this.clear();
    this.updateData(gapminder);
  }

  usePast() {
    this.clearAll();
    this.useOurSamples = false;
    this.dataText = ' ';
    this.formatTable = false;
  }

  useExampleDimension() {
    this.dataDims = this.chartType.dimExemple;
    this.processData();
  }

  clear() {
    this.headerValues = [];
    this.rawData = [];
    this.dataDims = [];
    return (this.data = []);
  }

  clearAll() {
    this.clear();
    this.dataText = '';
    this.chartType = null;
    this.theme = 'light';
  }

  choseChartType(chart) {
    this.chartType = chart;
    this.dataDims = [];
    this.processData();
  }

  processData() {
    if (!this.hasValidBuilder) {
      return;
    }

    this.data = this.chartType.convertData(this.dataDims, this.rawData);
    return this.data;
  }

  formTable(data) {
    this.headerValuesForTable = this.headerValues.map(key => ({
      data: key.data,
      title: key.title,
      type: key.type === 'string' ? 'text' : 'numeric'
    }));
    this.formatTable = true;
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  updateData(value = this._dataText) {
    this._dataText = value;
    const parsed = babyparse.parse(this._dataText, {
      header: true,
      dynamicTyping: true
    });

    this.errors = parsed.errors;

    if (this.errors.length) {
      return this.clear();
    }
    this.rawData = parsed.data;
    const headerValues = parsed.meta.fields.map(key => ({
      data: key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      type: typeof parsed.data[0][key]
    }));

    if (JSON.stringify(headerValues) !== JSON.stringify(this.headerValues)) {
      this.headerValues = headerValues.slice();
      this.dataDims = [];
      this.data = [];
    } else {
      this.processData();
    }
  }
}
