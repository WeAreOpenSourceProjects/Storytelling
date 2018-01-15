import { NgGridItemConfig } from "angular2-grid";

export interface Authenticate {
  email: string;
  password: string;
}

export interface User {
  id: number
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  roles: string[];
}

export interface MenuItem {
  order: number;
  link: string;
  name: string;
  icon: string;
  roles?: string[];
}

export class SlidesSetting {
  title: String = 'Slides '
  description: String = '';
  tags: Array<string> = [];
  public: Boolean = false;
  favorite: Boolean = false;
  author: String = '';
  banner: any;
  index:any = 1;
  constructor(setting?: SlidesSetting) {
      if (setting) {
          if (setting.title) this.title = setting.title;
          if (setting.description) this.description = setting.description;
          if (setting.tags) this.tags = setting.tags;
          if (setting.public) this.public = setting.public;
          if (setting.favorite) this.favorite = setting.favorite;
          if (setting.author) this.author = setting.author;
          if (setting.banner && setting.banner._id) this.banner = setting.banner._id;
      }
  }
}

export class Slide {
  id: string;
  boxes: [{
    config: NgGridItemConfig;
    text: any;
    chart: any;
    width: number;
    height: number;
  }] = [{
    config: {},
    text: '',
    chart: '',
    width: 0,
    height: 0
  }];
  title: string = '';
  index: number = 1;
  isValid: boolean = false;
  constructor(index?: number) {
    if (index) this.index = index;
  }
}

export class Slides {
  _id: string;
  id: string;
  slidesSetting: SlidesSetting;
  slides: Array<Slide> = [];
  constructor(slides?: Slides) {
    //for copy slides
    if (slides) {
      this.slidesSetting = new SlidesSetting(slides.slidesSetting);

      this.slidesSetting.title = this.slidesSetting.title + ' ' + 'copy';
      this.slides = slides.slides;
    }
  }
}

export interface Box {
  id: number,
  grid: {
    width: Number,
    height:  Number,
    top: Number,
    left: Number,
  },
  mime: String,
  content: any
}

export interface Presentation {
  _id?: number,
  id: number,
  title: string
  public: boolean,
  favorite: boolean,
  description: string,
  tags: string[],
  author: number,
  banner: any,
  slides: string[]
}

export interface Slide {
  id: string;
  index:number;
  boxeIds: Box[];
}
