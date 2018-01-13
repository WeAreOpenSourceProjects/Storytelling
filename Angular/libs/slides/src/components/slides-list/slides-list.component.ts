import { Component, OnInit } from '@angular/core';
//import { select } from '@angular-redux/store';

import {Observable} from 'rxjs/Observable';
import {SlidesService, ImagesService} from '../../services/index';
import {Slides, SlidesSetting} from '../../models/index';
//import {NotifBarService} from "app/core";
import { PageEvent } from '@angular/material';
import { PresentationsApiService } from '@labdat/presentations-state';
import { Presentation } from '@labdat/data-models';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { switchMap } from 'rxjs/operators/switchMap';

@Component({
  selector: 'app-slides-list',
  templateUrl: './slides-list.component.html',
  styleUrls: ['./slides-list.component.scss']
})
export class SlidesListComponent implements OnInit {
  //    @select(['session', 'token']) loggedIn$: Observable<string>;
  public loggedIn$ = Observable.of('me');
  private result = {
    noResult: false,
    noPublish: false,
    noSlides: false,
    noPrivate: false
  };
  public pageSize = 6;
  private pageIndex = 0;
  loading = true;
  listCopy = [];
  next: number = 0;
  private toSearch = {
    title: '',
    filter: 'All',
    favorite: 'All',
    order: '0'
  };
  pageEvent: PageEvent;
  public presentations: Array<Presentation> = [];
  public searchControl = new FormControl({
    term: '',
    favorite: true,
    unfavorite: true,
    public: true,
    private: true
  });

  constructor(
    private slidesService: PresentationsApiService,
    private imagesService: ImagesService ) /*        private notifBarService: NotifBarService */ { }

  ngOnInit() {

    this.searchControl.valueChanges
    .pipe(
      debounceTime(500),
      switchMap(search => this.slidesService.search(search, this.pageIndex, this.pageSize))
    )
    .subscribe(presentations => {
      this.presentations = presentations;
      this.result = this.calculResult(this.presentations.length, this.toSearch.filter, this.toSearch.title);
    })

    this.slidesService.getAll(this.pageIndex, this.pageSize).subscribe(
      presentations => {
        this.presentations = presentations;
        this.result = this.calculResult(this.presentations.length, this.toSearch.filter, this.toSearch.title);
        this.loading = false;
      },
      error => {
        //                this.notifBarService.showNotif("fail to load slides users-list");
      }
    );
  }

  nextPage($event) {
    this.pageEvent = $event;
    this.pageIndex = $event.pageIndex;
    this.slidesService
    .search(this.toSearch, this.pageIndex, this.pageSize)
    .subscribe(
      presentations => {
        this.presentations = presentations;
        this.result = this.calculResult(this.presentations.length, this.toSearch.filter, this.toSearch.title);
      },
    error => { /* this.notifBarService.showNotif("fail to load slides users-list");*/ }
    );
  }

  calculResult(slidesLength, state, title) {
    if (slidesLength === 0) {
      if (title === '') {
        if (state === 'All') {
          return { noResult: false, noPublish: false, noSlides: true, noPrivate: false };
        } else if (state === 'Public') {
          return { noResult: false, noPublish: true, noSlides: false, noPrivate: false };
        } else if (state === 'Private') {
          return { noResult: false, noPublish: false, noSlides: false, noPrivate: true };
        }
      } else {
        return { noResult: true, noPublish: false, noSlides: false, noPrivate: false };
      }
    }
    return { noResult: false, noPublish: false, noSlides: false, noPrivate: false };
  }

  duplicate(id) {
    this.slidesService.getOne(id).subscribe(presentation => {
      this.presentations.push(presentation);
    });
  }

  deletedSlides(id) {
    this.presentations.forEach((presentation, i) => {
      if (presentation.id === id) {
        this.presentations.splice(i, 1);
      }
    });
  }

  createSlides(){
      var presentation
      presentation.slidesSetting = new SlidesSetting();
      if (this.presentations.length>0 && this.presentations[this.presentations.length -1]){
//        presentation.slidesSetting.index =  this.presentations[this.presentations.length -1].slidesSetting.index+1
      }
      this.slidesService.add(presentation).subscribe(presentation => {
       this.presentations.push(presentation)
      })
  }
}
