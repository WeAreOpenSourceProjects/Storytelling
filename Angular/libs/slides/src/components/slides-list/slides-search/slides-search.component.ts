import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-slides-search',
  templateUrl: './slides-search.component.html',
  styleUrls: ['./slides-search.component.scss']
})
export class SlidesSearchComponent implements ControlValueAccessor {
  @Output()
  public textSearchOpt: EventEmitter<string> = new EventEmitter();

  @Output()
  public filterPubOpt = new EventEmitter(); //event for change pub filter

  @Output()
  public filterFavorOpt = new EventEmitter(); //event for change favor filter

  @Output()
  public sortedByOpt = new EventEmitter(); //event for change sort filter

  @Input()
  public kind: string;

  public states = {
    checkFavor: true,
    checkNotFavor: true,
    checkPrivate: true,
    checkPublic: true,
    sortedBy: 'alphabetically'
  };

  public textToSearch: string;

  public searchForm: FormGroup;

  get counterValue() {
    return this._counterValue;
  }

  set counterValue(val) {
    this._counterValue = val;
    this.propagateChange(this._counterValue);
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      term: '',
      favorite: true,
      public: true
    });
    this.formBuilder.
  }

  propagateChange = (_: any) => {};

  writeValue(value: any) {
    if (value !== undefined) {
      this.counterValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}


  onChange(textToSearch) {
    if (textToSearch) {
      this.textSearchOpt.emit(textToSearch);
    } else {
      this.textSearchOpt.emit('');
    }
  }

  onChangeState(change) {
    //filterFavorOpt: all
    if (change.source.name == 'checkFavor' || change.source.name == 'checkNotFavor') {
      if (this.states.checkFavor && this.states.checkNotFavor) this.filterFavorOpt.emit('All');
      else {
        if (this.states.checkFavor) this.filterFavorOpt.emit('favorite');
        else this.filterFavorOpt.emit('notFavorite');
      }
    } else {
      //filterPubOpt
      if (this.states.checkPrivate && this.states.checkPublic) this.filterPubOpt.emit('All');
      else {
        if (this.states.checkPrivate) this.filterPubOpt.emit('Private');
        else this.filterPubOpt.emit('Public');
      }
    }
  }

  sort(sortedBy) {
    this.sortedByOpt.emit(sortedBy);
  }
}
