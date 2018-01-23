import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { Slide } from '@labdat/data-models';

@Component({
  selector: 'app-slide-card',
  templateUrl: './slide-card.component.html',
  styleUrls: ['./slide-card.component.scss'],
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
export class SlideCardComponent {

  @Input()
  public index: number;

  @Output()
  delete = new EventEmitter<string>();

  @Output()
  select = new EventEmitter();

  constructor(private route: ActivatedRoute) { }


  public deleteSlide(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit();
  }

  public onClick() {
    this.select.emit();
  }

}
