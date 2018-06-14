import { Injectable, Inject } from '@angular/core';
import * as fromBoxes from '../+state/boxes.actions';
import { BoxesState } from '../+state/boxes.interfaces';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '@labdat/authentication';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators/first';
import { filter } from 'rxjs/operators/filter';

@Injectable()
export class BoxesInitializationService {
  constructor(private store: Store<BoxesState>) {}

  public loadBoxes(idSlide) {
    this.store
      .select(selectIsLoggedIn)
      .pipe(first(), filter(isLoggedIn => isLoggedIn))
      .subscribe(() => this.store.dispatch(new fromBoxes.Load(idSlide)));
  }
}
