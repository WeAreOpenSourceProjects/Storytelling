import { Directive, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Directive({
  selector: '[appKeySwitch]'
})
export class KeySwitchDirective implements OnInit {
  private delayDuration: number = 50;
  private static ArrowRightCode: number = 39;
  private static ArrowLeftCode: number = 37;
  @Output() keySwitch: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    let events = Observable.fromEvent(document, 'keydown', e => e);
    let firstEventObservable = events.take(1);
    let remainingEventsObservable = events
      .timeInterval()
      .filter(x => x.interval >= this.delayDuration)
      .map(x => x.value);
    let pageChangeObservable = firstEventObservable.concat(remainingEventsObservable);

    pageChangeObservable.subscribe(e => this.keySwitchFunc(e));
  }

  private keySwitchFunc(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KeySwitchDirective.ArrowRightCode:
        this.keySwitch.emit(1);
        break;
      case KeySwitchDirective.ArrowLeftCode:
        this.keySwitch.emit(-1);
        break;
      default:
        break;
    }
  }
}
