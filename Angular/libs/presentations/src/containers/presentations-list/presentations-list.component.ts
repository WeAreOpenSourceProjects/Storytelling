import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Slides, SlidesSetting } from '../../models/index';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Presentation } from '@labdat/data-models';
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
  selectCurrentPresentation,
  selectShowEmptyMessage } from '@labdat/presentations-state';
import { fromRouter } from '@labdat/router-state';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { PresentationDialogComponent } from '../../components/presentation-dialog/presentation-dialog.component';
import { filter } from 'rxjs/operators/filter';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { take } from 'rxjs/operators/take';
import { Subscription } from 'rxjs/Subscription';
import { zip } from 'rxjs/operators/zip';

@Component({
  selector: 'app-presentations-list',
  templateUrl: './presentations-list.component.html',
  styleUrls: ['./presentations-list.component.scss']
})
export class PresentationsListComponent implements OnInit, OnDestroy {

  public nextPage$ = new Subject();
  public togglePublish$ = new Subject();
  public toggleFavorite$ = new Subject();
  public copy$ = new Subject();
  public delete$ = new Subject();
  public add$ = new Subject();
  public edit$ = new Subject();
  public loggedIn$ = this.store.select(selectIsLoggedIn);
  public user$ = this.store.select(selectUser);
  public presentations$ = this.store.select(selectAllPresentations);
  public presentationsTotal$ = this.store.select(selectPresentationsTotal);
  public presentationsError$ = this.store.select(selectPresentationsError);
  public currentPresentation$ = this.store.select(selectCurrentPresentation);
  public searchObserver = new Subject();
  public selectShowEmptyMessage$ = this.store.select(selectShowEmptyMessage);
  public message$ = this.selectShowEmptyMessage$.pipe(
    withLatestFrom(this.searchObserver, (showMessage, search) => {
      if (showMessage) {
        return this.emptyMessage(search)
      }
      return '';
    })
  );
  private subscriptions: Subscription;

  constructor(
    private store: Store<PresentationsState>,
    private dialog: MatDialog ) { }

  ngOnInit() {

    this.subscriptions = this.searchObserver
    .pipe(
      debounceTime(500),
      withLatestFrom(this.user$))
    .subscribe(([formSearch, user]) => {
      const search = {
        ...formSearch,
        email: user.email,
        username: user.username
      }
      this.store.dispatch(new fromPresentations.Load({ pageIndex: 0, pageSize: 10, search}))
    })

    const nextPageSubscription = this.nextPage$
    .pipe(withLatestFrom(this.searchObserver))
    .subscribe(([pageEvent, search]: [PageEvent, any]) => this.store.dispatch(new fromPresentations.Load({ pageIndex: pageEvent.pageIndex, pageSize: 10, search})));
    this.subscriptions.add(nextPageSubscription);

    const togglePublishSubscription = this.togglePublish$
    .subscribe((presentation: Presentation) => this.store.dispatch(new fromPresentations.Update({id: presentation.id, changes: { isPublic: !presentation.isPublic }})));
    this.subscriptions.add(togglePublishSubscription);

    const toggleFavoriteSubscription = this.toggleFavorite$
    .subscribe((presentation: Presentation) => this.store.dispatch(new fromPresentations.Update({id: presentation.id, changes: { isFavorite: !presentation.isFavorite }})));
    this.subscriptions.add(toggleFavoriteSubscription);

    const copySubscription = this.copy$
    .subscribe((presentationId: string) => this.store.dispatch(new fromPresentations.Copy(presentationId)));
    this.subscriptions.add(copySubscription);

    const editSubscription = this.edit$
    .subscribe((presentationId: string) => this.store.dispatch(new fromRouter.Go({ path: ['presentations', presentationId, 'edit'] })));
    this.subscriptions.add(editSubscription);

    const addSubscription = this.add$
    .pipe(withLatestFrom(this.user$, (click, user) => user))
    .subscribe((user) => {
      const presentation = new Presentation();
      presentation.author = user;
      this.store.dispatch(new fromPresentations.Add(presentation));
    });
    this.subscriptions.add(addSubscription)

    const deleteSubscription = this.delete$
    .pipe(switchMap(presentationId => this.dialog.open(PresentationDialogComponent, { height: '20%', width: '20%', data: { presentationId } }).afterClosed()))
    .subscribe(result => {
      if (result.delete) {
        this.store.dispatch(new fromPresentations.Delete(result.presentationId))
      }
    });
    this.subscriptions.add(deleteSubscription)
  }

  private emptyMessage(search) {
    if (search.title) {
      return '<p> Oops, no result for these key words <p>'
    }
    if (search.isPublic) {
      return '<p>Sorry, no one publish slides yet!<br> Would you want to be the pioneer ?</p>'
    }
    return `<p>Sorry, you don't have any slides yet!</p>`;
  }

  public trackById(presentation) {
    return presentation.id
  }

  ngOnDestroy() {
    console.log('PresentationsListComponent')
    this.subscriptions.unsubscribe();
  }
}
