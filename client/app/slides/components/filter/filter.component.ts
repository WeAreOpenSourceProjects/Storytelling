import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Output() filterState = new EventEmitter();
  @Input() states = new Array<string>();
  @Input() selectedValue = '';

  constructor() { }

  ngOnInit() {

  }
  onChange(state) {
   this.filterState.emit(state);
  }
}
