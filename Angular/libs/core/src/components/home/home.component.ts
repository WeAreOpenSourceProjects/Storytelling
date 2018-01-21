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
  selectCurrentPresentation } from '@labdat/presentations-state';
import { skip } from 'rxjs/operators/skip';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public presentations$ = this.store.select(selectAllPresentations).pipe(skip(1));
  public subscriptions: Subscription;
  public showPublicSlides$ = new Subject<boolean>();
  public hide$ = of(false);
  public showAllPresentations$ = new Subject<boolean>();
  public noResult: boolean;
  public noPublish: boolean;
  private nextPage$ = new Subject();
  public searchControl = new FormControl({
    title: '',
    isFavorite: 'indeterminate',
    isPublic: true,
    order: 'date'
  });
  public searchObserver = new Subject();


  constructor(private presentationsApiService: PresentationsApiService, private store: Store<AuthenticationState>) {}

  ngOnInit() {
    this.noResult = false;
    this.noPublish = false;

    this.subscriptions = this.searchObserver
    .pipe(
      debounceTime(500))
    .subscribe(search =>
      this.store.dispatch(new fromPresentations.Load({
        pageIndex: 0,
        pageSize: 10,
        search
      }))
    )

    const nextPageSubscription = this.nextPage$
    .pipe(withLatestFrom(this.searchObserver))
    .subscribe(([pageEvent, search]: [PageEvent, any]) =>
      this.store.dispatch(new fromPresentations.Load({
        pageIndex: pageEvent.pageIndex,
        pageSize: 10, search
      }))
    );
    this.subscriptions.add(nextPageSubscription)

    this.hide$ = merge(this.searchObserver,this.showPublicSlides$)
    .pipe(mapTo(true))
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}


/*
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Slides, SlidesSetting } from '../../models/index';
//import {NotifBarService} from "app/core";
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Presentation } from '@labdat/data-models';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn, selectUser } from '@labdat/authentication-state';
import {
  selectAllPresentations,
  selectPresentationsError,
  PresentationsState,
  fromPresentations,
  selectPresentationsTotal,
  selectPresentationsEntities,
  selectCurrentPresentation } from '@labdat/presentations-state';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { PresentationDialogComponent } from '../../components/presentation-dialog/presentation-dialog.component';

@Component({
  selector: 'app-slides-list',
  templateUrl: './presentations-list.component.html',
  styleUrls: ['./presentations-list.component.scss']
})
export class PresentationsListComponent implements OnInit {

  public searchControl = new FormControl({
    title: '',
    isFavorite: 'indeterminate',
    isPublic: 'indeterminate',
    order: 'date'
  });

  public nextPage$ = new Subject();
  public togglePublish$ = new Subject();
  public toggleFavorite$ = new Subject();
  public copy$ = new Subject();
  public delete$ = new Subject();
  public add$ = new Subject();
  public select$ = new Subject();

  public loggedIn$ = this.store.select(selectIsLoggedIn);
  public user$ = this.store.select(selectUser);
  public presentations$ = this.store.select(selectAllPresentations);
  public presentationsCount$ = this.store.select(selectPresentationsTotal);
  public presentationsError$ = this.store.select(selectPresentationsError);
  public currentPresentation$ = this.store.select(selectCurrentPresentation)
  public message$ = this.searchControl.valueChanges.pipe(
    startWith({title: '', isPublic: 'indeterminate', isFavorite: 'indeterminate'}),
    combineLatest(this.presentationsCount$, (search, presentationCount) => this.emptyMessage(search, presentationCount))
  )

  constructor(
    private store: Store<PresentationsState>,
    private dialog: MatDialog ) { }

    ngOnInit() {

      this.searchControl.valueChanges
      .pipe(debounceTime(500), tap(console.log))
      .subscribe(search => this.store.dispatch(new fromPresentations.Load({ pageIndex: 0, pageSize: 10, search})))

      this.nextPage$
      .pipe(withLatestFrom(this.searchControl.valueChanges))
      .subscribe(([pageEvent, search]: [PageEvent, any]) => this.store.dispatch(new fromPresentations.Load({ pageIndex: pageEvent.pageIndex, pageSize: 10, search})));

      this.togglePublish$
      .subscribe((presentation: Presentation) => this.store.dispatch(new fromPresentations.Update({id: presentation.id, changes: { isPublic: !presentation.isPublic }})));

      this.toggleFavorite$
      .subscribe((presentation: Presentation) => this.store.dispatch(new fromPresentations.Update({id: presentation.id, changes: { isFavorite: !presentation.isFavorite }})));

      this.copy$
      .subscribe((presentationId: string) => this.store.dispatch(new fromPresentations.Copy(presentationId)));

      this.add$
      .pipe(withLatestFrom(this.user$, (click, user) => user))
      .subscribe((user) => {
        const presentation = new Presentation();
        presentation.author = user;
        this.store.dispatch(new fromPresentations.Add(presentation));
      });

      this.delete$
      .pipe(switchMap(presentationId => this.dialog.open(PresentationDialogComponent, { height: '20%', width: '20%', data: { presentationId } }).afterClosed()))
      .subscribe(result => {
        if (result.delete) {
          this.store.dispatch(new fromPresentations.Delete(result.presentationId))
        }
      });
    }

    emptyMessage(search, presentationCount) {
      let message = '';
      if (presentationCount === 0) {
        if (search.title) {
          message = '<p> Oops, no result for these key words <p>'
        } else if (search.isPublic) {
          message = `<p>Sorry, no one publish slides yet!<br> Would you want to be the pioneer ?</p>`
        } else if (!search.isPublic) {
          message = `<p>Sorry, you don't have any slides yet!</p>`
        } else if (search.isFavorite) {
          message = `<p>Sorry, you don't have any slides yet!</p>`
        }
      }
      return message;
    }

    trackById(presentation) {
      return presentation.id
    }
  }

  */
