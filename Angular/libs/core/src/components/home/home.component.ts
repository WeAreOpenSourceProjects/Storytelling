import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AuthenticationState, selectIsLoggedIn } from '@labdat/authentication-state';

import { SlidesService, Slides } from '@labdat/slides';
import { PageEvent } from '@angular/material';
import { Presentation } from '@labdat/data-models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public loggedIn$: Observable<boolean>;
  public presentations: Array<Presentation> = [];
  public showSlidesList: boolean;
  public noResult: boolean;
  public noPublish: boolean;
  public pageSize = 6;

  private toSearch;
  private pageIndex = 0;

  constructor(private slidesService: SlidesService, private store: Store<AuthenticationState>) {}

  ngOnInit() {
    this.showSlidesList = false;
    this.noResult = false;
    this.noPublish = false;
    this.toSearch = { title: '', filter: 'Public' };
    this.loggedIn$ = this.store.select(selectIsLoggedIn);
  }

  searchSlides(searchText) {
    //show slides and hide logo
    this.showSlidesList = true;
    //get search result
    this.toSearch.title = searchText;
    this.slidesService
    .getSlideToSearch(this.toSearch, this.pageIndex, this.pageSize)
    .subscribe(presentations => {
      this.presentations = presentations;
      this.noResult = (this.presentations.length === 0) ? true : false;
    });
  }

  getAllslides() {
    this.showSlidesList = true;
    this.toSearch.title = '';
    this.slidesService
    .getSlideToSearch(this.toSearch, this.pageIndex, this.pageSize)
    .subscribe(presentations => {
      this.presentations = presentations;
      this.noPublish = (this.presentations.length === 0) ? true : false

    });
  }

  nextPage($event) {
    this.pageIndex = $event.pageIndex;
    this.slidesService
    .getSlideToSearch(this.toSearch, this.pageIndex, this.pageSize)
    .subscribe(presentations => {
      this.presentations = presentations;
    });
  }
}
