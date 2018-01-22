import { Component, HostBinding, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'presentations-snack',
  template: '{{data}}'
})
export class SlidesSnackComponent {
  @HostBinding('class.mat-typography')
  matTypo() {
    return true;
  }

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
