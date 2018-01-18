import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() data: any[] = [];

  @Input() columns: any[] = [];

  @Output() updatedData = new EventEmitter();

  //  colHeaders: string[];

  constructor() {}

  ngOnInit() {
    //this.colHeaders = this.columns.map((col: any) =>  col.name );
    console.log('----  data  ---->', this.data);
    console.log('---- columns ---->', this.columns);
  }

  afterChange(e: any) {
    // tslint:disable-next-line:no-console
    this.updatedData.emit(this.data);
  }
}
