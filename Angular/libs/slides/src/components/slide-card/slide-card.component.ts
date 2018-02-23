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
}
