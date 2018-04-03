import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Slides, SlidesSetting } from '../../models/index';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
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
  selectShowEmptyMessage,
  selectPresentationsCount
} from '@labdat/presentations-state';
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
  @ViewChild(MatPaginator)
  public paginator;
  public nextPage$ = new Subject();
  public togglePublish$ = new Subject();
  public toggleFavorite$ = new Subject();
  public copy$ = new Subject();
  public delete$ = new Subject();
  public add$ = new Subject();
  public edit$ = new Subject();
  public select$ = new Subject();
  public loggedIn$ = this.store.select(selectIsLoggedIn);
  public user$ = this.store.select(selectUser);
  public presentationsCount$ = this.store.select(selectPresentationsCount);
  public presentations$ = this.store.select(selectAllPresentations);
  public presentationsTotal$ = this.store.select(selectPresentationsTotal);
  public presentationsError$ = this.store.select(selectPresentationsError);
  public currentPresentation$ = this.store.select(selectCurrentPresentation);
  public searchObserver = new Subject();
  public selectShowEmptyMessage$ = this.store.select(selectShowEmptyMessage);
  public count = 0;
  public message$ = this.selectShowEmptyMessage$.pipe(
    withLatestFrom(this.searchObserver, (showMessage, search) => {
      if (showMessage) {
        return this.emptyMessage(search);
      }
      return '';
    })
  );
  private subscriptions: Subscription;

  constructor(private store: Store<PresentationsState>, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions = this.searchObserver.pipe(withLatestFrom(this.user$)).subscribe(([formSearch, user]) => {
      const search = {
        ...formSearch,
        userId: user.id,
        username: user.username
      };
      this.store.dispatch(new fromPresentations.Search({ pageIndex: 0, pageSize: 6, search }));
    });
    const countPresentationSubscription = this.presentationsCount$.subscribe(count => {
      this.count = count;
    });
    this.subscriptions.add(countPresentationSubscription);
    this.subscriptions.add(countPresentationSubscription);

    const nextPageSubscription = this.nextPage$
      .pipe(withLatestFrom(this.searchObserver, this.user$, (pageEvent: PageEvent, formSearch: any, user: any) => {
        const search = {
          ...formSearch,
          userId: user.id,
          username: user.username
        };
        return [search, pageEvent]
      }))
      .subscribe(([search, pageEvent]) => {
        this.store.dispatch(new fromPresentations.Search({ pageIndex: pageEvent.pageIndex, pageSize: 6, search }));
      });
    this.subscriptions.add(nextPageSubscription);

    const togglePublishSubscription = this.togglePublish$.subscribe((presentation: Presentation) =>
      this.store.dispatch(
        new fromPresentations.Update({ id: presentation.id, changes: { isPublic: !presentation.isPublic } })
      )
    );
    this.subscriptions.add(togglePublishSubscription);

    const toggleFavoriteSubscription = this.toggleFavorite$.subscribe((presentation: Presentation) =>
      this.store.dispatch(
        new fromPresentations.Update({ id: presentation.id, changes: { isFavorite: !presentation.isFavorite } })
      )
    );
    this.subscriptions.add(toggleFavoriteSubscription);

    const copySubscription = this.copy$.subscribe((presentationId: string) =>
      this.store.dispatch(new fromPresentations.Copy(presentationId))
    );
    this.subscriptions.add(copySubscription);

    const editSubscription = this.edit$.subscribe((presentationId: string) =>
      this.store.dispatch(new fromRouter.Go({ path: ['presentations', presentationId, 'edit'] }))
    );
    this.subscriptions.add(editSubscription);

    const addSubscription = this.add$.subscribe(res => {
/*
      this.nextPage$.next({
        pageIndex: (this.count + 1) / 6
      });
*/
      const presentation = new Presentation();
      this.store.dispatch(new fromPresentations.Add(presentation));
    });
    this.subscriptions.add(addSubscription);

    const deleteSubscription = this.delete$
      .pipe(
        switchMap(presentationId =>
          this.dialog
            .open(PresentationDialogComponent, { height: '180px', width: '350px', data: { presentationId } })
            .afterClosed()
        ),
        tap(result => {
          if (result && result.delete) {
            this.store.dispatch(new fromPresentations.Delete(result.presentationId));
          }
        }),
        withLatestFrom(this.searchObserver, this.user$,
        (x: any, criterias: any, user: any) => ({
          ...criterias,
          userId: user.id,
          username: user.username
        })
      ))
      .subscribe(search => this.store.dispatch(new fromPresentations.Search({ pageIndex: this.paginator.pageIndex, pageSize: 7, search })));
    this.subscriptions.add(deleteSubscription);

    const selectSubscription = this.select$.subscribe(presentationId => {
      this.store.dispatch(new fromRouter.Go({ path: ['presentations', presentationId, 'view'] }));
    });
    this.subscriptions.add(selectSubscription);
  }

  private emptyMessage(search) {
    if (search.title) {
      return '<p> Oops, no result for these key words <p>';
    }
    if (search.isPublic) {
      return '<p>Sorry, no one publish slides yet!<br> Would you want to be the pioneer ?</p>';
    }
    return `<p>Sorry, you don't have any slides yet!</p>`;
  }

  public trackById(presentation) {
    return presentation.id;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
