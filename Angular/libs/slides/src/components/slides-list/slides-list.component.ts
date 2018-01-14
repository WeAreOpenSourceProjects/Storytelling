import { Component, OnInit } from '@angular/core';
//import { select } from '@angular-redux/store';

import {Observable} from 'rxjs/Observable';
import {SlidesService, ImagesService} from '../../services/index';
import {Slides, SlidesSetting} from '../../models/index';
//import {NotifBarService} from "app/core";
import { PageEvent } from '@angular/material';
import {  } from '@labdat/presentations-state';
import { Presentation } from '@labdat/data-models';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { Store } from '@ngrx/store';
import {
  selectAllPresentations,
  selectPresentationsError,
  PresentationsState,
  PresentationsApiService,
  fromPresentations } from '@labdat/presentations-state';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { Subject } from 'rxjs/Subject';
import { selectPresentationsTotal } from '@labdat/presentations-state/src/+state/presentations.selectors';

@Component({
  selector: 'app-slides-list',
  templateUrl: './slides-list.component.html',
  styleUrls: ['./slides-list.component.scss']
})
export class SlidesListComponent implements OnInit {
  //    @select(['session', 'token']) loggedIn$: Observable<string>;
  public loggedIn$ = Observable.of('me');

  loading = true;
  listCopy = [];
  next: number = 0;

  public searchControl = new FormControl({
    title: '',
    favorite: false,
    public: false,
  });

  public presentations$ = this.store.select(selectAllPresentations);
  public presentationsCount$ = this.store.select(selectPresentationsTotal);
  public presentationsError$ = this.store.select(selectPresentationsError);
  public nextPage$ = new Subject();

  constructor(
    private slidesService: PresentationsApiService,
    private imagesService: ImagesService,
    private store: Store<PresentationsState> ) { }
    /*        private notifBarService: NotifBarService */

  ngOnInit() {

    this.searchControl.valueChanges
    .pipe(debounceTime(500))
    .subscribe(search => this.store.dispatch(new fromPresentations.Load({ pageIndex: 0, pageSize: 10, search})))
    /*
    .subscribe(presentations => {
      this.presentations = presentations;
      this.result = this.calculResult(this.presentations.length, this.toSearch.filter, this.toSearch.title);
    })
*/  this.nextPage$
    .pipe(withLatestFrom(this.searchControl.valueChanges))
    .subscribe(([pageEvent, search]: [PageEvent, any]) => this.store.dispatch(new fromPresentations.Load({ pageIndex: pageEvent.pageIndex, pageSize: 10, search})));
  }

  duplicate(id) {
    this.slidesService.getOne(id).subscribe(presentation => {
      //this.presentations.push(presentation);
    });
  }

  deletedSlides(id) {/*
    this.presentations.forEach((presentation, i) => {
      if (presentation.id === id) {
        this.presentations.splice(i, 1);
      }
    });*/
  }

  createSlides(){/*
      var presentation
      presentation.slidesSetting = new SlidesSetting();
      if (this.presentations.length>0 && this.presentations[this.presentations.length -1]){
//        presentation.slidesSetting.index =  this.presentations[this.presentations.length -1].slidesSetting.index+1
      }
      this.slidesService.add(presentation).subscribe(presentation => {
       this.presentations.push(presentation)
      })*/
  }
}
