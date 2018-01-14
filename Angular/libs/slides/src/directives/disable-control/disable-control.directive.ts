import { NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl( condition : boolean ) {
    (condition)
    ? this.ngControl.control.enabled && this.ngControl.control.disable()
    : this.ngControl.control.disabled && this.ngControl.control.enable();
  }

  constructor( private ngControl : NgControl ) { }

}
