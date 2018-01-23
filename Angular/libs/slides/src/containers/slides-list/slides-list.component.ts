import {
  Component,
  Input,
  Output,
  EventEmitter,
  QueryList,
  OnChanges,
  ViewEncapsulation,
  ViewChildren,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Slide } from '@labdat/data-models';
import { DragulaService } from 'ng2-dragula';
// import { ValidService } from '../../../services/valid.service';
//import {NotifBarService} from 'app/core';
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
  selectCurrentPresentationSlides,
  selectCurrentPresentationId } from '@labdat/presentations-state';
import { fromSlides } from '@labdat/slides-state';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { fromRouter } from '@labdat/router-state';
import { MatDialog } from '@angular/material/dialog';
import { SlideDialogComponent } from '../../components/slide-dialog/slide-dialog.component'

@Component({
  selector: 'app-slides-list',
  templateUrl: './slides-list.component.html',
  styleUrls: ['./slides-list.component.scss'],
  providers: [DragulaService],
  encapsulation: ViewEncapsulation.None
})
export class SlidesListComponent implements OnInit, OnDestroy {

  public add$ = new Subject();
  public delete$ = new Subject();
  public select$ = new Subject();
  private currentPresentationId$ = this.store.select(selectCurrentPresentationId)
  public currentPresentationSlides$ = this.store.select(selectCurrentPresentationSlides)

  @Input()
  public slideIds: string[]

  @Output()
  public submit = new EventEmitter();

  @Output()
  public bannerImageUpload = new EventEmitter();

  @Output()
  public slideDeleted = new EventEmitter();

  @Output()
  public errorsHandle = new EventEmitter();

  @Output()
  public onShuffle = new EventEmitter();

  private subscriptions: Subscription;

  constructor(
    private dragulaService: DragulaService,
    private dialog: MatDialog,
    private store: Store<PresentationsState>) { }

  ngOnInit() {
    this.dragulaService.setOptions('shuffle-bag', {
 //     moves: (el, source, handle, sibling) => !(this.slideOpendIndex != null && this.slideOpendIndex > 0)
    });
/*
    this.dragulaService.drag.subscribe(value => {
      console.log(`drag: ${value[0]}`);
      this.onShuffle.emit(true);
    });
    this.dragulaService.out.subscribe(value => {
      console.log(`drop: ${value[0]}`);
      this.onShuffle.emit(false);
    });
*/
    this.subscriptions = this.add$.pipe(
      withLatestFrom(this.currentPresentationId$)
    ).subscribe(([click, presentationId]) => {
        const newSlide = new Slide();
        newSlide.presentationId = presentationId;
        this.store.dispatch(new fromSlides.Add(newSlide))
    });

    const deleteSubscription = this.delete$.pipe(
      switchMap(slideId => this.dialog.open(SlideDialogComponent, { height: '20%', width: '20%', data: { slideId } }).afterClosed())
    )
    .subscribe(result => {
      if (result.delete) {
        this.store.dispatch(new fromSlides.Delete(result.slideId))
      }
    });
    this.subscriptions.add(deleteSubscription)

    const selectSubscription = this.select$
    .subscribe(slideId => {
      this.store.dispatch(new fromRouter.Go({ path: ['slides', slideId] }))
    });
    this.subscriptions.add(selectSubscription)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
