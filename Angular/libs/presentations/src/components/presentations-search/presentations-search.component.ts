import { Component, OnInit, Output, Input, EventEmitter, forwardRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { /*MAT_CHECKBOX_CLICK_ACTION,*/ MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs/Subscription';
import { PartialObserver } from 'rxjs/Observer';

@Component({
  selector: 'app-slides-search',
  templateUrl: './presentations-search.component.html',
  styleUrls: ['./presentations-search.component.scss']/*,
  providers: [
    {
      provide: MAT_CHECKBOX_CLICK_ACTION,
      useValue: 'noop'
    }
  ]
*/
})
export class PresentationsSearchComponent implements OnDestroy {
  @Input() public kind: string;

  @Input() public searchObserver: PartialObserver<any>;

  public searchForm: FormGroup;
  private subscriptions: Subscription;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      title: this.formBuilder.control(''),
//      isFavorite: this.formBuilder.control('indeterminate'),
      status: this.formBuilder.control('all'),
      order: this.formBuilder.control('date')
    });

    this.searchObserver.next({
      title: '',
//      isFavorite: 'indeterminate',
      status: 'all',
      order: 'date'
    });

    this.subscriptions = this.searchForm.valueChanges.subscribe(this.searchObserver);
  }
/*
  onClick(checkbox: MatCheckbox) {
    const name = checkbox.name;
    if (checkbox.indeterminate) {
      checkbox.indeterminate = false;
      this.searchForm.get(name).setValue(true);
    } else if (this.searchForm.get(name).value) {
      this.searchForm.get(name).setValue(false);
      return;
    } else {
      checkbox.indeterminate = true;
      this.searchForm.get(name).setValue('indeterminate');
    }
  }
*/

  onOrderChange(select: MatSelect) {
    this.searchForm.get('order').setValue(select.value);
  }

  onStatusChange(select: MatSelect) {
    this.searchForm.get('status').setValue(select.value);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
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
