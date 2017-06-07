import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {SlidesService} from '../../services/index';
import {Slides} from '../../models/index'
@Component({
    selector: 'app-slides-manager',
    templateUrl: './slides-manager.component.html',
    styleUrls: ['./slides-manager.component.scss']
})
export class SlidesManagerComponent implements OnInit {
    @select(['session', 'token']) loggedIn$: Observable<string>;
    states = ['All', 'Private', 'Public'];
    toSearch = {
        title: '',
        filter: 'All'
    };
    slides: Array<Slides> = [];
    constructor(
        private slidesService: SlidesService
    ) { }

    ngOnInit() {
      this.slidesService.getSlidesList()
          .subscribe(
          slide => {
              console.log('toto: ', slide);
              /*slide.forEach(s => this.slides.push(new SlidesListItem(s.slidesSetting)))*/
              this.slides = slide;
              console.log(this.slides);
          },
          error => {
              console.log('fail to get Slides list');
          });
    }

    search(paramsTosearch) {
        console.log("search trigger");
        //get search result
        this.toSearch.title = paramsTosearch || '';
        this.slidesService.getSlideToSearch(this.toSearch)
            .subscribe(slides => {
                this.slides = [];
                this.slides = slides;
                console.log(slides);
            });
    }

    filterState(state) {
        this.toSearch.filter = state;
        this.slidesService.getSlideToSearch(this.toSearch)
            .subscribe(slides => {
                this.slides = [];
                this.slides = slides;
            });
    }
    refreshList() {
        this.slidesService.getSlidesList()
            .subscribe(
                slide => {
                    this.slides = slide;
                },
                error => {
                    console.log('fail to get Slides list');
                });
    }

}
