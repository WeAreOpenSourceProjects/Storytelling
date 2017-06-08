import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    @Output() textSearch: EventEmitter<string> = new EventEmitter();
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
    ngOnInit() {}

}
