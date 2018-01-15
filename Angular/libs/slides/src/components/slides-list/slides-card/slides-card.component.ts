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
import { User } from '@labdat/data-models';

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

  @Input()
  public loggedIn: boolean;

  @Input()
  public user: User;

  @Output()
  public deletedSlides = new EventEmitter();

  @Output()
  public publishChange = new EventEmitter();

  @Output()
  public favoriteChange = new EventEmitter();

  @Output()
  public duplicateslidesOpt = new EventEmitter();
  //    @select(['session', 'token']) loggedIn$: Observable<string>;
  //    @select(['session', 'user', 'username']) username$: Observable<Object>;

  public loggedIn$: Observable<boolean> = this.store.select(selectIsLoggedIn);
  public userName$ = this.store.select(selectUser)
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

  public togglePublish(event) {
      //            elm => this.notifBarService.showNotif("set upload status successfully!"),
      //            error => this.notifBarService.showNotif("fail to set upload status, error is " + error)
      event.preventDefault();
      event.stopPropagation();
      this.publishChange.emit(this.presentation.id)
  }
  /*set like/dislike presentation*/
  public toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteChange.emit(this.presentation.id)
  }
  /*delete the whole presentation*/
  deleteSlides(event) {
    event.preventDefault();
    event.stopPropagation();
    const dialog = this.dialog.open(DeleteDialogComponent, { height: '20%', width: '20%' });
    dialog.afterClosed().subscribe(result => {
      if (result === 'YES') {
        // this.notifBarService.showNotif("the presentation has been deleted successfully!");
        // error => this.notifBarService.showNotif("fail to delete the presentation, error is " + error)
        this.deletedSlides.emit(this.presentation.id);
      }
    });
  }
  /*duplicate presentation*/
  duplicateSlides(event) {
    event.preventDefault();
    event.stopPropagation();
    this.duplicateslidesOpt.emit(this.presentation.id);
    // this.notifBarService.showNotif("presentation has been copied");
    // this.notifBarService.showNotif("Opps! fail to copy the presentation. error :" + error);

  }

  public showOptions(): boolean {
    return this.loggedIn
    && this.editable
    && this.presentation
    && this.presentation.author === this.user.id;
  }
}
