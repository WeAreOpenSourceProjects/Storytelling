import { Injectable, Inject } from "@angular/core";
import * as fromPresentations from "../+state/presentations.actions";
import { PresentationsState } from "../+state/presentations.interfaces";
import { Store } from "@ngrx/store";
import { selectIsLoggedIn } from "@labdat/authentication-state";
import { Observable } from "rxjs/Observable";
import { first } from "rxjs/operators/first";
import { filter } from "rxjs/operators/filter";

@Injectable()
export class PresentationsInitializationService {
  constructor(private store: Store<PresentationsState>) { }

  public loadPresentations() {
    this.store.select(selectIsLoggedIn)
    .pipe(
      first(),
      filter(isLoggedIn => isLoggedIn)
    )
    .subscribe(() => this.store.dispatch(new fromPresentations.Load({ pageIndex: 0, pageSize: 10 })));
  }
}
