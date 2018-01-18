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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public loggedIn$: Observable<boolean>;
  public presentations$: Observable<Array<Presentation>> = of([]);
  public showSlidesList: boolean;
  public noResult: boolean;
  public noPublish: boolean;
  public pageSize = 6;

  private toSearch;
  private pageIndex = 0;

  constructor(private presentationsApiService: PresentationsApiService, private store: Store<AuthenticationState>) {}

  private nextPage$ = new Subject();

  public searchControl = new FormControl({
    title: '',
    isFavorite: 'indeterminate',
    isPublic: true,
    order: 'date'
  });

  ngOnInit() {
    this.showSlidesList = false;
    this.noResult = false;
    this.noPublish = false;
    this.toSearch = { title: '', filter: 'isPublic' };
    this.loggedIn$ = this.store.select(selectIsLoggedIn);

    this.presentations$ = this.searchControl.valueChanges
    .pipe(
      switchMap(search => this.presentationsApiService.search(0, 10, search)),
      map(result => result.presentations)
    )

    this.nextPage$
    .pipe(
      withLatestFrom(this.searchControl.valueChanges),
      switchMap(([pageEvent, search]: [PageEvent, any]) =>
        this.presentationsApiService.search(pageEvent.pageIndex, pageEvent.pageSize, search)),
      map(result => result.presentations)
    )
    .subscribe(result => {
      this.presentations = result.presentations;
      this.noResult = (this.presentations.length === 0) ? true : false;
    });


  }

  searchSlides(searchText) {
    //show slides and hide logo
    this.showSlidesList = true;
    //get search result
    this.toSearch.title = searchText;
    this.presentationsApiService
    .search(this.toSearch, this.pageIndex, this.pageSize)
    .subscribe(presentations => {
      this.presentations = presentations;
      this.noResult = (this.presentations.length === 0) ? true : false;
    });
  }

  getAllslides() {
    this.showSlidesList = true;
    this.toSearch.title = '';
    this.presentationsApiService
    .search(this.toSearch, this.pageIndex, this.pageSize)
    .subscribe(presentations => {
      this.presentations = presentations;
      this.noPublish = (this.presentations.length === 0) ? true : false
    });
  }

  nextPage($event) {
    this.pageIndex = $event.pageIndex;
    this.presentationsApiService
    .search(this.toSearch, this.pageIndex, this.pageSize)
    .subscribe(presentations => {
      this.presentations = presentations;
    });
  }
}
