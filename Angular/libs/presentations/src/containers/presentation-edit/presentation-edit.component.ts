import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators/map';
import { ActivatedRoute, Router } from '@angular/router';
import { PresentationsApiService } from '@labdat/presentations-state';
import { ValidService } from '../../services/valid.service';
import { Presentation } from '@labdat/data-models';
//import { SlidesEditorComponent } from './slides-editor/slides-editor.component';
import { forEach } from '@angular/router/src/utils/collection';
import { Store } from '@ngrx/store';
import { PresentationsState, selectCurrentPresentation, fromPresentations } from '@labdat/presentations-state';
import { Subject } from 'rxjs/Subject';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { tap } from 'rxjs/operators/tap';
import { filter } from 'rxjs/operators/filter';
import { isEmpty } from 'lodash';
import { fromRouter } from '@labdat/router-state';

@Component({
  selector: 'app-slides-editor-form',
  templateUrl: './presentation-edit.component.html',
  styleUrls: ['./presentation-edit.component.scss'],
  providers: [PresentationsApiService, ValidService]
})
export class PresentationEditComponent implements OnInit, AfterViewChecked {

  private editorValid: Subscription; //validation of slide editor
  private errorMsg; //error
  private isRequired = false;
  private isInShuffle = false;

  private currentPresentation$ = this.store.select(selectCurrentPresentation)
  public currentPresentationSettings$ = this.currentPresentation$
  .pipe(
    filter((presentation: Presentation) => !isEmpty(presentation)),
    map(presentation => ({
      title: presentation.title,
      description: presentation.description,
      tags: presentation.tags,
      banner: presentation.banner
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
    .subscribe(([click, settings, presentation]: [Event, any, Presentation]) =>
      this.store.dispatch(new fromPresentations.Update({ id: presentation.id, changes: settings }))
    );
  }

  public cancel() {
    this.store.dispatch(new fromRouter.Go({ path: ['presentations'] }));
  }


  ngOnDestroy() {
    console.log('PresentationEditComponent')
    this.subscriptions.unsubscribe();
  }
}
