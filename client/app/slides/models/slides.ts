import {Slide} from './slide';
import {SlidesSetting} from './slides-setting';
export class Slides {
    _id: string;
    slidesSetting: SlidesSetting;
    slides: Array<Slide> = [];
    constructor(slides?: Slides) {
        //for copy slides
        if (slides) {
            this.slidesSetting = new SlidesSetting(slides.slidesSetting);

            this.slidesSetting.title = this.slidesSetting.title + " " + "copy"
            this.slides = slides.slides;
        }

    }
}
