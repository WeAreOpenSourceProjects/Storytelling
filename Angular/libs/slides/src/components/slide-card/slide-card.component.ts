import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Slide } from '@labdat/data-models';

@Component({
  selector: 'app-slide-card',
  templateUrl: './slide-card.component.html',
  styleUrls: ['./slide-card.component.scss']
})
export class SlideCardComponent {
  @Input() public index: number;
  @Input() public slide: Slide;

  @Output() delete = new EventEmitter<string>();

  @Output() select = new EventEmitter();

  constructor(private route: ActivatedRoute) {}

  public deleteSlide(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit();
  }

  public onClick() {
    this.select.emit();
  }

  public getImage() {
    return this.slide.screenShot ? 'url(' + this.slide.screenShot + ')' : "url('assets/logo_full_banner.png')";
  }
}
