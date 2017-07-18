
import {Component, Input} from '@angular/core'

@Component({
    selector: 'image',
    template: `
    <div class="img-container">  <img [src]="path" class="img-cmp"></div>

  `,
})
export class ImageComponent {
    @Input() path: string;

}
