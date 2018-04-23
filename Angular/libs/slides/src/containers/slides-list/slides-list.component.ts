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
  OnDestroy,
  ViewChild
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
import { selectSlideIds, selectAllSlides, SlidesState } from '@labdat/slides-state';
import { selectCurrentPresentationId } from '@labdat/slides-state';
import { fromSlides } from '@labdat/slides-state';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { fromRouter } from '@labdat/router-state';
import { MatDialog } from '@angular/material/dialog';
import { SlideDialogComponent } from '../../components/slide-dialog/slide-dialog.component';
import { zip } from 'rxjs/observable/zip';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators/take';
import { SlideCardComponent } from '../../components/slide-card/slide-card.component';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { cloneDeep, xorBy, remove } from 'lodash';

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

  private currentPresentationId$ = this.store.select(selectCurrentPresentationId);
  public slides$ = this.store.select(selectAllSlides);
  public slides: Slide[];

  public slideIds$ = this.store.select(selectSlideIds);

  private drag$ = new Subject();
  private out$ = new Subject();

  private subscriptions: Subscription;

  constructor(private dragulaService: DragulaService, private dialog: MatDialog, private store: Store<SlidesState>) {}

  ngOnInit() {
    this.subscriptions = this.slides$.subscribe(slides => {
      if (this.slides === undefined) {
        return (this.slides = cloneDeep(slides));
      }
      if (this.slides.length === slides.length) {
        return slides.forEach(slide => {
          const index = this.slides.findIndex(s => s.id === slide.id);
          if (index !== -1) {
            this.slides[index].index = slide.index;
          }
        });
      }
      const slide = xorBy(this.slides, slides, 'id')[0];
      if (this.slides.length < slides.length) {
        return this.slides.push(cloneDeep(slide));
      }
      if (this.slides.length > slides.length) {
        return remove(this.slides, s => s.id === slide.id);
      }
    });

    this.dragulaService.drag.subscribe(value => this.drag$.next(value));

    this.dragulaService.out.subscribe(value => this.out$.next(value));

    const dragSubscriptions = this.drag$
      .pipe(switchMap(drag => zip(of(cloneDeep(this.slides)), this.out$.pipe(take(1)), (oldSlides, out) => oldSlides)))
      .subscribe(oldSlides => {
        const oldSlideIds = oldSlides.map(slide => slide.id);
        const newSlideIds = this.slides.map(slide => slide.id);
        const toUpdate = [];
        oldSlideIds.forEach((slideId: string, index: number) => {
          const oldSlideId = slideId;
          const newSlideId = newSlideIds[index];
          if (oldSlideId !== newSlideId) {
            toUpdate.push({ id: newSlideId, changes: { index: index + 1 } });
          }
        });
        if (toUpdate.length !== 0) {
          this.store.dispatch(new fromSlides.BulkUpdate(toUpdate));
        }
      });
    this.subscriptions.add(dragSubscriptions);

    const addSubscription = this.add$
      .pipe(withLatestFrom(this.currentPresentationId$))
      .subscribe(([click, presentationId]) => {
        const newSlide = new Slide();
        newSlide.presentationId = presentationId;
        this.store.dispatch(new fromSlides.Add(newSlide));
      });
    this.subscriptions.add(addSubscription);

    const deleteSubscription = this.delete$
      .pipe(
        switchMap(slideId =>
          this.dialog.open(SlideDialogComponent, { height: '160px', width: '350px', data: { slideId } }).afterClosed()
        )
      )
      .subscribe(result => {
        if (result && result.delete) {
          this.store.dispatch(new fromSlides.Delete({ slideId: result.slideId }));
        }
      });
    this.subscriptions.add(deleteSubscription);

    const selectSubscription = this.select$.subscribe(slideId => {
      this.store.dispatch(new fromRouter.Go({ path: ['slides', slideId] }));
    });
    this.subscriptions.add(selectSubscription);
  }

  public trackById(slide) {
    return slide._id;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
