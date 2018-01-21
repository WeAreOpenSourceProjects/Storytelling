import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AuthenticationState, selectIsLoggedIn } from '@labdat/authentication-state';

import { PresentationsApiService } from '@labdat/presentations-state';
import { PageEvent } from '@angular/material';
import { Presentation } from '@labdat/data-models';
import { FormControl } from '@angular/forms';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { Subject } from 'rxjs/Subject';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { mapTo } from 'rxjs/operators/mapTo';
import { startWith } from 'rxjs/operators/startWith';
import { debounceTime } from 'rxjs/operators/debounceTime';
import {
  selectAllPresentations,
  selectPresentationsError,
  PresentationsState,
  fromPresentations,
  selectPresentationsTotal,
  selectPresentationsEntities,
  selectPresentationsLoading,
  selectCurrentPresentation } from '@labdat/presentations-state';
import { skip } from 'rxjs/operators/skip';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators/take';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { tap } from 'rxjs/operators/tap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public presentations$ = this.store.select(selectAllPresentations).pipe(skip(1));
  public presentationsTotal$ = this.store.select(selectPresentationsTotal);
  public presentationsLoading$ = this.store.select(selectPresentationsLoading);
  public subscriptions: Subscription;
  public showPublicSlides$ = new Subject<boolean>();
  public showPublicPresentations$ = new Subject<boolean>();
  private nextPage$ = new Subject();
  public searchObserver = new Subject();
  public message$ = this.presentations$.pipe(
    filter(presentations => presentations.length === 0),
    withLatestFrom(
      this.searchObserver.pipe(startWith({ title: '', isPublic: true, isFavorite: 'indeterminate' })),
      (presentations, search) => this.emptyMessage(search))
  )

  public hide$ = merge(this.searchObserver,this.showPublicPresentations$)
  .pipe(mapTo(true));

  constructor(private presentationsApiService: PresentationsApiService, private store: Store<AuthenticationState>) {}

  ngOnInit() {
    this.subscriptions = merge(
      this.showPublicPresentations$.pipe(mapTo({ title: '', isPublic: true, isFavorite: 'indeterminate'})),
      this.searchObserver
    ).pipe(debounceTime(500))
    .subscribe((search: any) => {
      search.isPublic = true
      this.store.dispatch(new fromPresentations.Load({
        pageIndex: 0,
        pageSize: 6,
        search
      }))
    })

    const nextPageSubscription = this.nextPage$
    .pipe(withLatestFrom(this.searchObserver))
    .subscribe(([pageEvent, search]: [PageEvent, any]) =>
      this.store.dispatch(new fromPresentations.Load({
        pageIndex: pageEvent.pageIndex,
        pageSize: 6, search
      }))
    );
    this.subscriptions.add(nextPageSubscription)
  }

  emptyMessage(search) {
    if (search.title.length > 0) {
      return '<p>Oops, no result for these key words</p>';
    }
    return `<p>Sorry, no one publish slides yet! Would you want to be the pioneer ?</p>`
  }

  trackById(presentation) {
    return presentation.id
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
