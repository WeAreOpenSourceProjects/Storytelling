import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {Chart} from '../../chart.class';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent extends Chart implements OnInit {
  
  data: Array<any> = [];

  private width: number;
  private height: number;

  view: any[];
  showLegend: boolean = true;
  legendTitle: string = 'Legend';
  gaugeTextValue: string = '';
  colorScheme: any;
  gaugeMin: number = 0;
  gaugeMax: number = 100;
  gaugeUnits: string ;
  gaugeAngleSpan: number = 240;
  gaugeStartAngle: number = -120;
  gaugeShowAxis: boolean = true;
  gaugeLargeSegments: number = 10;
  gaugeSmallSegments: number = 5;

  // margin
  margin: boolean = false;
  marginTop: number = 40;
  marginRight: number = 40;
  marginBottom: number = 40;
  marginLeft: number = 40;

  tooltipDisabled = false;

  constructor() { 
       super()  
    }

  ngOnInit() {
    this.colorScheme = {
      name: 'gauge',
      selectable: true,
      group: 'Ordinal',
      domain: [
        '#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886'
      ]
    }

    // Set data
    console.log(this.dataInput);
    if (this.dataInput[0]) {
      this.gaugeUnits = this.dataInput[0].unit;
      this.data =  this.dataInput[0].results;
    } else {
      this.gaugeUnits = this.dataInput.unit;
      this.data =  this.dataInput.results;
    }

  }

  init() {
    // this.width = 700;
    // this.height = 300;
    // this.view = [this.width, this.height];
  }

  load() {
    this.data = [...this.data];
  }


  ease() {
  }

  select(data) {
    console.log('Item clicked', data);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

}
