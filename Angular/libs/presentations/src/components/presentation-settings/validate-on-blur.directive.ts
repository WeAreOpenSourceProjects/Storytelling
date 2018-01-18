import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[validateOnBlur]'
})
export class ValidateOnBlurDirective {
  @Output() addTagOpt: EventEmitter<any> = new EventEmitter();

  constructor() {}

  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
    this.addTagOpt.emit();
  }
}
