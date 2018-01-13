import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';
import { Presentation } from '@labdat/data-models';
import { SlidesService, ImagesService } from '../../../services';
import { MatDialog } from '@angular/material';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
//import { NotifBarService } from 'app/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { selectUser, selectIsLoggedIn, AuthenticationState } from '@labdat/authentication-state';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { PresentationsApiService } from '@labdat/presentations-state';

@Component({
  selector: 'app-slides-card',
  templateUrl: './slides-card.component.html',
  styleUrls: ['./slides-card.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        animate(
          300,
          keyframes([
            style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
      transition('* => void', [
        animate(
          300,
          keyframes([
            style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(15px)', offset: 0.7 }),
            style({ opacity: 0, transform: 'translateX(-100%)', offset: 1.0 })
          ])
        )
      ])
    ])
  ]
})
export class SlidesCardComponent implements OnInit {
  @Input()
  public presentation: Presentation;

  @Input()
  public editable: boolean; // whether the presentation can be edited;

  @Output()
  public deletedSlides = new EventEmitter();

  @Output()
  public duplicateslidesOpt = new EventEmitter();
  //    @select(['session', 'token']) loggedIn$: Observable<string>;
  //    @select(['session', 'user', 'username']) username$: Observable<Object>;

  public loggedIn$: Observable<boolean> = this.store.select(selectIsLoggedIn);
  public userName$ = this.store
    .select(selectUser)
    .pipe(filter(user => !isEmpty(user)), map(user => user.firstName + user.lastName));

  public banner: string; // banner picture of the presentation card

  constructor(
    private slidesService: PresentationsApiService,
    private imagesService: ImagesService,
    private dialog: MatDialog,
    private store: Store<AuthenticationState>
   /*        private notifBarService: NotifBarService */ ) {
    this.banner = '';
  }

  ngOnInit() {
    /*after load presentation info, load presentation banner*/
    if (this.presentation.banner) {
      this.imagesService.getImage(this.presentation.banner).subscribe(_banner => {
        this.banner = _banner;
      });
    }
  }

  /*publish/unpublish presentation*/
  togglePublish(e) {
    e.stopPropagation();
    this.presentation.public = !this.presentation.public;
    this.slidesService
      .update(this.presentation, this.presentation._id)
      .subscribe
      //            elm => this.notifBarService.showNotif("set upload status successfully!"),
      //            error => this.notifBarService.showNotif("fail to set upload status, error is " + error)
      ();
  }
  /*set like/dislike presentation*/
  toggleFavorite(e) {
    e.stopPropagation();
    this.presentation.favorite = !this.presentation.favorite;
    this.slidesService
      .update(this.presentation, this.presentation._id)
      .subscribe
      //            elm => this.notifBarService.showNotif("set favorte status successfully!"),
      //            error => this.notifBarService.showNotif("fail to set favorite status, error is " + error)
      ();
  }
  /*delete the whole presentation*/
  deleteSlides(e, id) {
    e.stopPropagation();

    const dialog = this.dialog.open(DeleteDialogComponent, { height: '20%', width: '20%' });
    dialog.afterClosed().subscribe(result => {
      if (result === 'YES') {
        this.slidesService.delete(id).subscribe(
          res => {
            //                        this.notifBarService.showNotif("the presentation has been deleted successfully!");
            this.deletedSlides.emit(id);
          }
          //                    error => this.notifBarService.showNotif("fail to delete the presentation, error is " + error)
        );
      }
    });
  }
  /*duplicate presentation*/
  duplicateSlides(e, presentation) {
    e.stopPropagation();
    let newPresentation: Presentation = presentation;
    console.log(newPresentation);
    this.slidesService.add(newPresentation).subscribe(
      data => {
        this.duplicateslidesOpt.emit(data._id);
        //                this.notifBarService.showNotif("presentation has been copied");
      },
      error => {
        //                this.notifBarService.showNotif("Opps! fail to copy the presentation. error :" + error);
      }
    );
  }

  public showOptions(): Observable<boolean> {
    return combineLatest(
      this.loggedIn$,
      this.userName$,
      (loggedIn, userName) => loggedIn && this.editable && this.presentation && this.presentation.author === userName
    );
  }
}
