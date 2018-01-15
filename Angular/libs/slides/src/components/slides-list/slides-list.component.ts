import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SlidesService, ImagesService } from '../../services/index';
import { Slides, SlidesSetting } from '../../models/index';
//import {NotifBarService} from "app/core";
import { PageEvent } from '@angular/material';
import {  } from '@labdat/presentations-state';
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
  PresentationsApiService,
  fromPresentations,
  selectPresentationsTotal,
  selectPresentationsEntities } from '@labdat/presentations-state';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-slides-list',
  templateUrl: './slides-list.component.html',
  styleUrls: ['./slides-list.component.scss']
})
export class SlidesListComponent implements OnInit {


  //next: number = 0;

  public searchControl = new FormControl({
    title: '',
    favorite: 'indeterminate',
    public: 'indeterminate',
    order: 'date'
  });

  public nextPage$ = new Subject();
  public togglePublish$ = new Subject();
  public toggleFavorite$ = new Subject();
  public delete$ = new Subject();
  public duplicate$ = new Subject();

  public loggedIn$ = this.store.select(selectIsLoggedIn);
  public user$ = this.store.select(selectUser);
  public presentations$ = this.store.select(selectAllPresentations);
  public presentationsCount$ = this.store.select(selectPresentationsTotal);
  public presentationsError$ = this.store.select(selectPresentationsError);
  public message$ = this.searchControl.valueChanges
    .pipe(
      startWith({title: '', public: 'indeterminate', favorite: 'indeterminate'}),
      combineLatest(this.presentationsCount$, (search, presentationCount) => this.emptyMessage(search, presentationCount))
    )

  constructor(
    private slidesService: PresentationsApiService,
    private imagesService: ImagesService,
    private store: Store<PresentationsState> ) { }
    /*        private notifBarService: NotifBarService */

  ngOnInit() {

    this.searchControl.valueChanges
    .pipe(debounceTime(500), tap(console.log))
    .subscribe(search => this.store.dispatch(new fromPresentations.Load({ pageIndex: 0, pageSize: 10, search})))

    this.nextPage$
    .pipe(withLatestFrom(this.searchControl.valueChanges))
    .subscribe(([pageEvent, search]: [PageEvent, any]) => this.store.dispatch(new fromPresentations.Load({ pageIndex: pageEvent.pageIndex, pageSize: 10, search})));

    this.togglePublish$
    .subscribe((presentation: Presentation) => this.store.dispatch(new fromPresentations.Update({id: presentation.id, changes: { public: !presentation.public }})));

    this.toggleFavorite$
    .subscribe((presentation: Presentation) => this.store.dispatch(new fromPresentations.Update({id: presentation.id, changes: { favorite: !presentation.favorite }})));

    this.duplicate$
    .subscribe((presentation: Presentation) => this.store.dispatch(new fromPresentations.Add(presentation)));

    this.delete$
    .subscribe((presentationId: number) => this.store.dispatch(new fromPresentations.Delete(presentationId)));

  }

  emptyMessage(search, presentationCount) {
    let message = '';
    let isEmpty = presentationCount === 0
    if (isEmpty) {
      if (search.title) {
        message = '<p> Oops, no result for these key words <p>'
      } else if (search.public) {
        message = `<p>Sorry, no one publish slides yet!<br> Would you want to be the pioneer ?</p>`
      } else if (!search.public) {
        message = `<p>Sorry, you don't have any slides yet!</p>`
      } else if (search.favorite) {
        message = `<p>Sorry, you don't have any slides yet!</p>`
      }
    }
    return message;
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

  trackById(presentation) {
    return presentation.id
  }
}
