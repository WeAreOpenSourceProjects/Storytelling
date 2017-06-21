import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Slide} from "../../../../models/slide";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-slide-preview',
  templateUrl: './slide-preview.component.html',
  styleUrls: ['./slide-preview.component.scss']
})
export class SlidePreviewComponent implements OnInit {
  @Input () slide : Slide;
  constructor() { }

  ngOnInit() {
    console.log('init');
  }
}
