import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {SlidesService, ImagesService} from '../../services/index';
import {Slides} from '../../models/index';
import {NotifBarService} from "app/core";
import {PageEvent} from '@angular/material';
@Component({
    selector: 'app-slides-list',
    templateUrl: './slides-list.component.html',
    styleUrls: ['./slides-list.component.scss']
})

export class SlidesListComponent implements OnInit {
    @select(['session', 'token']) loggedIn$: Observable<string>;
    private result = {
        noResult: false,
        noPublish: false,
        noSlides: false,
        noPrivate: false
    };
    private pageSize = 6;
    private pageIndex = 0;
    loading =true;
    listCopy = [];
    next: number = 0;
    private toSearch = {
        title: '',
        filter: 'All',
        favorite: 'All',
        order : '0'
    };
    pageEvent: PageEvent;
    private slides: Array<Slides> = [];
    private length = this.slides.length;

    constructor(
        private slidesService: SlidesService,
        private imagesService: ImagesService,
        private notifBarService: NotifBarService
    ) { }
    nextPage($event) {
        this.pageEvent = $event;
        this.pageIndex = $event.pageIndex;
        this.slidesService.getSlideToSearch(this.toSearch, this.pageIndex, this.pageSize )
            .subscribe(
                slides => {
                    this.slides = slides[0];
                    this.length = slides[1];
                    this.result = this.calculResult(this.slides.length, this.toSearch.filter, this.toSearch.title);
                },
                error => {
                    this.notifBarService.showNotif("fail to load slides users-list");
                });
    }
    ngOnInit() {
        this.slidesService.getSlidesList( this.pageIndex, this.pageSize )
            .subscribe(
            slides => {
                this.slides = slides[0];
                this.length = slides[1];
                this.result = this.calculResult(this.slides.length, this.toSearch.filter, this.toSearch.title);
            },
            error => {
                this.notifBarService.showNotif("fail to load slides users-list");
            },() => { this.loading = false;});
    }
    search(paramsTosearch) {
        //get search result
        this.toSearch.title = paramsTosearch || '';
        this.refreshList();

    }

    filterPub(state) {
        this.toSearch.filter = state;
        this.refreshList();
    }
    filterFavor(isFavorite) {
        this.toSearch.favorite = isFavorite;
        this.refreshList();
    }
    sortedOrder(order) {
        this.toSearch.order = order;
        this.refreshList();
    }
    refreshList() {
        this.slidesService.getSlideToSearch(this.toSearch, this.pageIndex, this.pageSize)
            .subscribe(slides => {
                this.slides = [];
                this.slides = slides[0];
                this.length = slides[1];
                this.result = this.calculResult(this.slides.length, this.toSearch.filter, this.toSearch.title);

            });
    }
    calculResult(slidesLength, state, title) {
        if (slidesLength === 0) {
            if (title === "") {
                if (state === "All") {
                    return { noResult: false, noPublish: false, noSlides: true, noPrivate: false };
                } else if (state === "Public") {
                    return { noResult: false, noPublish: true, noSlides: false, noPrivate: false };
                } else if (state === "Private") {
                    return { noResult: false, noPublish: false, noSlides: false, noPrivate: true };
                }
            } else {
                return { noResult: true, noPublish: false, noSlides: false, noPrivate: false };
            }
        }
        return { noResult: false, noPublish: false, noSlides: false, noPrivate: false };
    }
    duplicate(id){
        this.slidesService.getSlides(id).subscribe(slides => {
           this.slides.push(slides);
        });
    }
    deletedSlides(id){
        this.slides.forEach((slides, i) => {
            if (slides._id === id) {
                this.slides.splice(i, 1);
                return;
            }
        });
    }
}
