import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public loggedIn$ = this.store.select(selectIsLoggedIn);
  public presentations$: Observable<Array<Presentation>> = of([]);
  public showPublicSlides$ = new Subject<boolean>();
  public hide$ = of(false);
  public showAllPresentations$ = new Subject<boolean>();
  public noResult: boolean;
  public noPublish: boolean;

  constructor(private presentationsApiService: PresentationsApiService, private store: Store<AuthenticationState>) {}

  private nextPage$ = new Subject();

  public searchControl = new FormControl({
    title: '',
    isFavorite: 'indeterminate',
    isPublic: true,
    order: 'date'
  });

  ngOnInit() {
    this.noResult = false;
    this.noPublish = false;

    this.presentations$ = this.searchControl.valueChanges
    .pipe(
      switchMap(search => this.presentationsApiService.search(0, 6, search)),
      map(result => result.presentations)
    )

    this.hide$ = merge(this.searchControl.valueChanges,this.showPublicSlides$)
    .pipe(mapTo(true))

    this.nextPage$
    .pipe(
      withLatestFrom(this.searchControl.valueChanges),
      switchMap(([pageEvent, search]: [PageEvent, any]) =>
        this.presentationsApiService.search(pageEvent.pageIndex, pageEvent.pageSize, search)),
      map(result => result.presentations)
    )
    .subscribe(result => {
//      this.presentations = result.presentations;
//      this.noResult = (this.presentations.length === 0) ? true : false;
    });


  }
}
