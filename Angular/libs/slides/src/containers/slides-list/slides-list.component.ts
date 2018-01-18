import {
  Component,
  Input,
  Output,
  EventEmitter,
  QueryList,
  OnChanges,
  ViewEncapsulation,
  ViewChildren,
  OnInit
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
  selectCurrentPresentation } from '@labdat/presentations-state';
@Component({
  selector: 'app-slides-list',
  templateUrl: './slides-list.component.html',
  styleUrls: ['./slides-list.component.scss'],
  providers: [DragulaService],
  encapsulation: ViewEncapsulation.None
})
export class SlidesListComponent implements OnInit {
  curSlideIndex = 1; // the slide that will be created(the amounts of slides pages +1 )
  isValidated = false;
  isValidatedSlide = true;
  isValidatedSetting = false;
  slideOpendIndex: number;
/*
  @Input()
  public slides: Slide[];
*/

  public currentPresentationSlides$ = this.store.select(selectCurrentPresentation)

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

  constructor(
    private dragulaService: DragulaService,
    // private validService: ValidService,
    private store: Store<PresentationsState>) { }

  ngOnInit() {
    this.dragulaService.setOptions('shuffle-bag', {
      moves: (el, source, handle, sibling) => !(this.slideOpendIndex != null && this.slideOpendIndex > 0)
    });
    this.dragulaService.drag.subscribe(value => {
      console.log(`drag: ${value[0]}`);
      this.onShuffle.emit(true);
    });
    this.dragulaService.out.subscribe(value => {
      console.log(`drop: ${value[0]}`);
      this.onShuffle.emit(false);
    });
  }

  slideValidateChange(status) {
    this.isValidatedSlide = status;
    this.checkValid();
  }

  checkValid() {
    if (this.isValidatedSetting && this.isValidatedSlide) {
      this.isValidated = true;
    } else {
      this.isValidated = false;
    }
  }
  /*add a new page of slide*/
  add() {
    /*
    let s = new Slide(this.curSlideIndex++);
//    this.slider.slides.push(s);
    this.isValidatedSlide = false;
    this.validService.changeSlideValid(false, this.curSlideIndex - 1);
    this.checkValid();
    */
  }

  /* delete a page of slide*/
  delete(index) {
    /*
    try {
      if (index < this.curSlideIndex) {
//        this.slider.slides.splice(index - 1, 1);
        /*change slide index
        this.slider.slides.forEach(s => {
          if (s.index > index - 1) {
            s.index--;
          }
        });
        // slide deleted in local
        this.curSlideIndex--;
      }
      this.validService.changeSlideValid(true, index, 'DELETE');
      this.slideDeleted.emit(this.curSlideIndex);
    } catch (err) {
      //            this.notifBarService.showNotif('delete fail : ' + err);
    }*/
  }

  save(result) {
    this.errorsHandle.emit(result);
  }
}
