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
import { selectSlidesIds } from '@labdat/slides-state';
import { selectCurrentPresentationId, PresentationsState, fromPresentations } from '@labdat/presentations-state';
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
  public slideIds$ = this.store.select(selectSlidesIds)

  @ViewChild('container')
  public container: any;

  @Output()
  public submit = new EventEmitter();

  @Output()
  public bannerImageUpload = new EventEmitter();

  @Output()
  public slideDeleted = new EventEmitter();

  @Output()
  public errorsHandle = new EventEmitter();

  private out$ = new Subject();

  private subscriptions: Subscription;

  constructor(
    private dragulaService: DragulaService,
    private dialog: MatDialog,
    private store: Store<PresentationsState>) { }

  ngOnInit() {/*
    this.dragulaService.setOptions('shuffle-bag', {
 //     moves: (el, source, handle, sibling) => !(this.slideOpendIndex != null && this.slideOpendIndex > 0)
      moves: (el, source, handle, sibling) => true
  });
*/

    this.dragulaService.out
    .subscribe(value => this.out$.next(value));

    this.out$.pipe(
      withLatestFrom(this.currentPresentationId$)
    )
    .subscribe(([value, presentationId]) => {
      const cards = Array.from(this.container.nativeElement.querySelectorAll('app-slide-card'));
      const slideIds = cards.map((card: HTMLElement) => card.id)
      this.store.dispatch(new fromPresentations.Update({ id: presentationId, changes: { slideIds }}))
    });

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
