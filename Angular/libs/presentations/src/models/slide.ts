import { GridsterConfig, GridsterItem } from 'angular-gridster2';

export class Slide {
  boxes: [GridsterItem];
  title: string = '';
  index: number = 1;
  isValid: boolean = false;
  constructor(index?: number) {
    if (index) this.index = index;
  }
}
