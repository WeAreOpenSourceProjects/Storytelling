import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators/map';
import { ActivatedRoute, Router } from '@angular/router';
import { PresentationsApiService } from '@labdat/presentations-state';
import { ValidService } from '../../services/valid.service';
import { Presentation } from '@labdat/data-models';
//import { SlidesEditorComponent } from './slides-editor/slides-editor.component';
//import { NotifBarService } from 'app/core';
import { forEach } from '@angular/router/src/utils/collection';
import { Store } from '@ngrx/store';
import { PresentationsState, selectCurrentPresentation, fromPresentations } from '@labdat/presentations-state';
import { Subject } from 'rxjs/Subject';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { tap } from 'rxjs/operators/tap';
import { filter } from 'rxjs/operators/filter';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-slides-editor-form',
  templateUrl: './presentation-detail.component.html',
  styleUrls: ['./presentation-detail.component.scss'],
  providers: [PresentationsApiService, ValidService]
})
export class PresentationDetailComponent implements OnInit, AfterViewChecked {

  private editorValid: Subscription; //validation of slide editor
  private errorMsg; //error
  private isRequired = false;
  private isInShuffle = false;
  loading = true;

  private currentPresentation$ = this.store.select(selectCurrentPresentation)
  public currentPresentationSettings$ = this.currentPresentation$
  .pipe(
    filter((presentation: Presentation) => !isEmpty(presentation)),
    map(presentation => ({
      title: presentation.title,
      description: presentation.description,
      tags: presentation.tags
    }))
  );
  public update$ = new Subject();
  public settingsObserver$ = new Subject<any>();

  private subscriptions: Subscription;
//  @ViewChild('editor')
//  _editor: SlidesEditorComponent;
//  _editor: any;

  constructor(
    private router: Router,
    private validService: ValidService,
    private route: ActivatedRoute,
    private store: Store<PresentationsState>,
    //        private notifBarService: NotifBarService,
    private cdRef: ChangeDetectorRef
  ) {
    this.errorMsg = [];
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.subscriptions = this.update$.pipe(
      withLatestFrom(
        this.settingsObserver$,
        this.currentPresentation$
      )
    )
    .subscribe(([click, settings, presentation]: [Event, any, Presentation]) => this.store.dispatch(new fromPresentations.Update({ id: presentation.id, changes: settings })))
  }

  // TODO rework service, rename in presentatiion
  errorsHandle(currentSlide) {
    /*
    if (currentSlide.isValid) {
      this.errorMsg = [];
      this.slider.slides.forEach(
        (slide, index) =>
          !slide.isValid
            ? this.errorMsg.push({ msg: 'Slide ' + (index + 1) + ' is not finished', index: index + 1 })
            : false
      );
    }
    */
  }

  slideDeleted(index) {
    this.errorMsg.forEach((arrayMsg, i) => {
      if (arrayMsg.index === index) {
        this.errorMsg.splice(i, 1);
      }
    });
  }

  onShuffle(shuffle) {
    this.isInShuffle = shuffle;
    if (!shuffle) {
      this.errorMsg = [];
    }
  }

  slidesSettingChange(setting) {
//    this.slider.slidesSetting = setting;
  }
  /* validate status change*/
  settingValidateChange(status) {
//    this.isValidatedSetting = status;
//    this.checkValid();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
