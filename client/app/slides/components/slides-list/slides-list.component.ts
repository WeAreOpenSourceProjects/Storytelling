import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {SlidesService,ImagesService} from '../../services/index';
import {Slides} from '../../models/index'
import {NotifBarService} from "app/core";
@Component({
  selector: 'app-slides-list',
  templateUrl: './slides-list.component.html',
  styleUrls: ['./slides-list.component.scss']
})

export class SlidesListComponent implements OnInit{
  @select(['session', 'token']) loggedIn$: Observable<string>;
  private states = ['All', 'Private', 'Public'];
  private selectedState = 'All';
  private selectedFavorite = 'All';
  private result = {
    noResult: false,
    noPublish: false,
    noSlides: false,
    noPrivate: false
  };
  private toSearch = {
    title: '',
    filter: 'All',
    favorite: 'All'
  };
  private slides: Array<Slides> = [];
  constructor(
    private slidesService: SlidesService,
    private imagesService:ImagesService,
    private notifBarService:NotifBarService
  ) { }

  ngOnInit() {
    this.slidesService.getSlidesList()
      .subscribe(
      slide => {
        this.slides = slide;
        this.result = this.calculResult(this.slides.length, this.toSearch.filter, this.toSearch.title);
        console.log("hi0");
        //after load slides, fetch banner pic
        /*     this.slides.forEach(s=>{
     this.imagesService.getImage("595ca2e3fd66fd11a5e4b9cf").subscribe(
            banner=>{

            }
          )
        })*/

      },
      error => {
        this.notifBarService.showNotif("fail to load slides list");
      });
  }
  search(paramsTosearch) {
    //get search result
    this.toSearch.title = paramsTosearch || '';
    this.slidesService.getSlideToSearch(this.toSearch)
      .subscribe(slides => {
        this.slides = [];
        this.slides = slides;
        this.result = this.calculResult(this.slides.length, this.toSearch.filter, this.toSearch.title)
      });
  }

  fState(state) {
    this.toSearch.filter = state;
    this.slidesService.getSlideToSearch(this.toSearch)
      .subscribe(slides => {
        this.slides = [];
        this.slides = slides;
        this.result = this.calculResult(this.slides.length, this.toSearch.filter, this.toSearch.title)
      });
  }
  refreshList() {
    this.slidesService.getSlideToSearch(this.toSearch)
      .subscribe(slides => {
        this.slides = [];
        this.slides = slides;
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
  fFavorite(isFavorite) {
    this.toSearch.favorite = isFavorite;
    this.slidesService.getSlideToSearch(this.toSearch)
      .subscribe(slides => {
        this.slides = [];
        this.slides = slides;
        this.result = this.calculResult(this.slides.length, this.toSearch.filter, this.toSearch.title)
      });

  }

}
