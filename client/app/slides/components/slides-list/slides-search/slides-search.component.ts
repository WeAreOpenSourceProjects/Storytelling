import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-slides-search',
  templateUrl: './slides-search.component.html',
  styleUrls: ['./slides-search.component.scss']
})
export class SlidesSearchComponent implements OnInit {
  @Output() textSearch: EventEmitter<string> = new EventEmitter();
  @Input() kind: string;

  @Output() fState = new EventEmitter();
  @Input() states = new Array<string>();
  @Input() selectedState = '';

  @Output() fFavorite = new EventEmitter();
  @Input() selectedFavorite = '';

  textToSearch: string;

  constructor() {
  }

  onChange(textToSearch) {
    if (textToSearch) {
      this.textSearch.emit(textToSearch);
    } else {
      this.textSearch.emit('');
    }
  }

  onChangeState(state) {
    this.fState.emit(state);
  }

  onChangeFavorite(isFavorite) {
    this.fFavorite.emit(isFavorite);
  }

  ngOnInit() { }

}
