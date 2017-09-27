import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-slides-search',
    templateUrl: './slides-search.component.html',
    styleUrls: ['./slides-search.component.scss']
})
export class SlidesSearchComponent implements OnInit {
    @Output() textSearchOpt: EventEmitter<string> = new EventEmitter(); //event for change search text
    @Output() filterPubOpt = new EventEmitter(); //event for change pub filter
    @Output() filterFavorOpt = new EventEmitter(); //event for change favor filter
    @Output() sortedByOpt = new EventEmitter(); //event for change sort filter

    @Input() kind: string;
    private states = {
        checkFavor: true,
        checkNotFavor: true,
        checkPrivate: true,
        checkPublic: true,
        sortedBy: 'alphabetically'
    };

    private textToSearch: string;

    constructor() {

    }
    ngOnInit() { }
    /*change search text*/
    onChange(textToSearch) {
        if (textToSearch) {
            this.textSearchOpt.emit(textToSearch);
        } else {
            this.textSearchOpt.emit('');
        }
    }
    /*change filter*/
    onChangeState(change) {
        //filterFavorOpt: all
        if (change.source.name == 'checkFavor' || change.source.name == 'checkNotFavor') {
            if (this.states.checkFavor && this.states.checkNotFavor) this.filterFavorOpt.emit("All");
            else {
                if (this.states.checkFavor) this.filterFavorOpt.emit("favorite");
                else this.filterFavorOpt.emit("notFavorite");
            }
        }
        //filterPubOpt
        else {
            if (this.states.checkPrivate && this.states.checkPublic) this.filterPubOpt.emit("All");
            else {
                if (this.states.checkPrivate) this.filterPubOpt.emit("Private");
                else this.filterPubOpt.emit("Public");
            }
        }

    }

    sort(sortedBy) {
        console.log(sortedBy);
        this.sortedByOpt.emit(sortedBy);
    }



}
