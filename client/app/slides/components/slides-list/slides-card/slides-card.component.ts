import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Slides } from '../../../models/slides';
import { SlidesService } from '../../../services/slides.service';
import { MdDialog } from '@angular/material';
import { DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {NotifBarService} from 'app/core';
@Component({
    selector: 'app-slides-card',
    templateUrl: './slides-card.component.html',
    styleUrls: ['./slides-card.component.scss']
})
export class SlidesCardComponent implements OnInit {
    @Input() slides: Slides;
    @Input() editable: boolean; //whether the slides can be edited;
    @Output() deletedSlides = new EventEmitter();
    @Output() duplicateslidesOpt = new EventEmitter();
    @select(['session', 'token']) loggedIn$: Observable<string>;
    @select(['session', 'user', 'username']) username$: Observable<Object>;

    constructor(private slidesService: SlidesService, private dialog: MdDialog, private notifBarService: NotifBarService) {
    }

    ngOnInit() {
    }

    open(e) {
        e.stopPropagation();
    }

    publish(e) {
        e.stopPropagation();
        this.slides.slidesSetting.public = !this.slides.slidesSetting.public;
        this.slidesService.updateSlide(this.slides, this.slides._id)
            .subscribe(
            elm => this.notifBarService.showNotif("set upload status successfully!"),
            error => this.notifBarService.showNotif("fail to set upload status, error is " + error)
            );
    }
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
        this.slidesService.submitSlides(newSlide)
            .subscribe(
            data => {
                this.duplicateslidesOpt.emit();
                this.notifBarService.showNotif("slides has been copied");
            },
            error => {
                this.notifBarService.showNotif("Opps! fail to copy the slides. error :" + error);
            });
    }
}
