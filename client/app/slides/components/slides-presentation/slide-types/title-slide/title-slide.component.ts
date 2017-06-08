import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-title-slide',
  templateUrl: './title-slide.component.html',
  styleUrls: ['./title-slide.component.scss']
})
export class TitleSlideComponent implements OnInit {

  @Input() slideTitle: string;
  
  constructor() { }

  ngOnInit() {
  }

}
