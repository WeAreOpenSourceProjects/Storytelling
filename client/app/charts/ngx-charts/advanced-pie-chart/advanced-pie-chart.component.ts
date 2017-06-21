import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {Chart} from '../../chart.class';
import { formatLabel } from "@swimlane/ngx-charts";
@Component({
  selector: 'app-advanced-pie-chart',
  templateUrl: './advanced-pie-chart.component.html',
  styleUrls: ['./advanced-pie-chart.component.scss']
})
export class AdvancedPieChartComponent extends Chart implements OnInit, OnDestroy {
  
  data: Array<any> = [];

  private width: number;
  private height: number;
  private _setIntervalHandler: any;

  view: any[];

  colorScheme: any;
  gradient = false;
  tooltipDisabled = false;


  // margin
  private margin: any = { top: 20, bottom: 20, left: 40, right: 40 };

  constructor() {
       super();
    }

   ngOnInit() {
    this.colorScheme = {
      name: 'pie',
      selectable: true,
      group: 'Ordinal',
      domain: [
        '#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886'
      ]
    }

    // Set the data
     if (this.dataInput[0]) {
       this.data =  this.dataInput[0].results;
     } else {
       this.data =  this.dataInput.results;
     }
    this.init();
  }

  init() {
    // this.width = 700;
    // this.height = 300;
    // this.view = [this.width, this.height];
  }


  load() {
    this.data = [];
    this._setIntervalHandler =  setTimeout(() => this.data = this.dataInput[0].results);
  }


  ease() {
  }

  select(data) {
    console.log('Item clicked', data);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  pieTooltipText({data}) {
    const label = formatLabel(data.name);
    const val = formatLabel(data.value);

    return `
      <span class="tooltip-label">${label}</span>
      <span class="tooltip-val">$${val}</span>
    `;
  }

  ngOnDestroy() {
    clearTimeout(this._setIntervalHandler);
  }

}
