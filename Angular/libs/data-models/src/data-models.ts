import { NgGridItemConfig } from "angular2-grid";

export interface Authenticate {
  email: string;
  password: string;
}

export interface User {
  id?: string
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
/*
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
*/

export interface Box {
  _id?: string,
  id?: string,
  grid: {
    width: Number,
    height:  Number,
    top: Number,
    left: Number,
  },
  mime: String,
  content: any
}

export interface IPresentation {
  _id?: string,
  id?: string,
  title?: string
  public?: boolean,
  favorite?: boolean,
  description?: string,
  tags?: string[],
  authorId?: string,
  banner?: any,
  slideIds?: string[]
}

export class Presentation {
  constructor(
    public _id?: string,
    public id?: string,
    public title?: string,
    public isPublic?: boolean,
    public isFavorite?: boolean,
    public description?: string,
    public tags?: string[],
    public authorId?: string,
    public banner?: any,
    public slideIds?: string[]
  ) {
    this.title = 'New Presentation';
  }
}

export interface ISlide {
  _id?: string;
  id?: string;
  index?:number;
  boxIds?: Box[];
}

export class Slide implements ISlide {
  constructor(
    public _id?: string,
    public id?: string,
    public index?:number,
    public boxIds?: Box[]
  ) { }
}