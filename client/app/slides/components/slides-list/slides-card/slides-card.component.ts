import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core'
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Slides } from '../../../models/slides';
import { SlidesService, ImagesService } from '../../../services';
import { MdDialog } from '@angular/material';
import { DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {NotifBarService} from 'app/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
    selector: 'app-slides-card',
    templateUrl: './slides-card.component.html',
    styleUrls: ['./slides-card.component.scss'],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => *', [
                animate(300, keyframes([
                    style({opacity: 0, transform: 'translateX(100%)', offset: 0}),
                    style({opacity: 1, transform: 'translateX(-15px)',  offset: 0.3}),
                    style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
                ]))
            ]),
            transition('* => void', [
                animate(300, keyframes([
                    style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
                    style({opacity: 1, transform: 'translateX(15px)', offset: 0.7}),
                    style({opacity: 0, transform: 'translateX(-100%)',  offset: 1.0})
                ]))
            ])
        ])
    ]
})
export class SlidesCardComponent implements OnInit {
    @Input() slides: Slides;
    @Input() editable: boolean; // whether the slides can be edited;
    @Output() deletedSlides = new EventEmitter();
    @Output() duplicateslidesOpt = new EventEmitter();
    @select(['session', 'token']) loggedIn$: Observable<string>;
    @select(['session', 'user', 'username']) username$: Observable<Object>;

    private banner:string; // banner picture of the slides card

    constructor(
        private slidesService: SlidesService,
        private imagesService: ImagesService,
        private dialog: MdDialog,
        private notifBarService: NotifBarService) {
          this.banner=""
    }

    ngOnInit() {
      /*after load slides info, load slides banner*/
        if (this.slides.slidesSetting.banner) {
            this.imagesService.getImage(this.slides.slidesSetting.banner).subscribe(
                _banner => {
                    this.banner = _banner;
                }
            )
        }
    }

    /*publish/unpublish slides*/
    togglePublish(e) {
        e.stopPropagation();
        this.slides.slidesSetting.public = !this.slides.slidesSetting.public;
        this.slidesService.updateSlide(this.slides, this.slides._id)
            .subscribe(
            elm => this.notifBarService.showNotif("set upload status successfully!"),
            error => this.notifBarService.showNotif("fail to set upload status, error is " + error)
            );
    }
    /*set like/dislike slides*/
    toggleFavorite(e) {
        e.stopPropagation();
        this.slides.slidesSetting.favorite = !this.slides.slidesSetting.favorite;
        this.slidesService.updateSlide(this.slides, this.slides._id)
            .subscribe(
            elm => this.notifBarService.showNotif("set favorte status successfully!"),
            error => this.notifBarService.showNotif("fail to set favorite status, error is " + error)
            );
    }
    /*delete the whole slides*/
    deleteSlides(e, id) {
        e.stopPropagation();
        const dialog = this.dialog.open(DeleteDialogComponent);
        dialog.afterClosed().subscribe(result => {
            if (result === 'YES') {
                this.slidesService.deleteSlides(id)
                    .subscribe(res => {
                        this.notifBarService.showNotif("the slides has been deleted successfully!");
                        this.deletedSlides.emit(id);
                    },
                    error => this.notifBarService.showNotif("fail to delete the slides, error is " + error));
            }
        });

    }
    /*duplicate slides*/
    duplicateSlides(e, slides) {
        e.stopPropagation();
        let newSlide: Slides = new Slides(slides);
        console.log(newSlide);
        this.slidesService.submitSlides(newSlide)
            .subscribe(
            data => {
                this.duplicateslidesOpt.emit(data._id);
                this.notifBarService.showNotif("slides has been copied");
            },
            error => {
                this.notifBarService.showNotif("Opps! fail to copy the slides. error :" + error);
            });
    }
}
