import {Slide} from './slide';
import {SlidesSetting} from './slides-setting';
export class Slides {
    _id: string;
    slidesSetting: SlidesSetting;
    slides: Array<Slide> = [];
    constructor() {

    }
}
