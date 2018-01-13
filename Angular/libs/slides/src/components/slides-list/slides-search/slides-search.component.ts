import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  forwardRef} from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-slides-search',
  templateUrl: './slides-search.component.html',
  styleUrls: ['./slides-search.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SlidesSearchComponent),
    multi: true
  }]
})
export class SlidesSearchComponent implements ControlValueAccessor {

  @Input()
  public kind: string;

  public searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      term: [''],
      favorite: [true],
      unfavorite: [true],
      public: [true],
      private: [true]
    });

    this.searchForm.valueChanges
    .subscribe(search => this.propagateChange(search))
  }

  propagateChange = (_: any) => {};

  writeValue(search: any) {
    if (search !== undefined) {
      this.searchForm.setValue(search);
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

/*
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
  }*/
}
