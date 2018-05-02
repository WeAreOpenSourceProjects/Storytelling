import { NgGridItemConfig } from 'angular2-grid';

export interface Authenticate {
  email: string;
  password: string;
}

export interface User {
  _id?: string;
  id?: string;
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

export interface Box {
  slideId?: string;
  _id?: string;
  id?: string;
  width?: Number;
  height?: Number;
  top?: Number;
  left?: Number;
  mime?: String;
  content?: any;
  x?: Number;
  y?: Number;
  cols?: Number;
  rows?: Number;
  minItemCols?: Number;
  minItemRows?: Number;
  editMode?: Boolean;
}

export interface IPresentation {
  _id?: string;
  id?: string;
  title?: string;
  public?: boolean;
  favorite?: boolean;
  description?: string;
  tags?: string[];
  author?: User;
  banner?: any;
  slideIds?: string[];
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
    public author?: User,
    public banner?: any,
    public slideIds?: string[]
  ) {
    this.title = 'New Presentation';
  }
}

export interface ISlide {
  _id?: string;
  id?: string;
  index?: number;
  presentationId?: string;
  boxIds?: Box[];
  background?: {
    color: string;
    image: string;
  };
  screenShot?: any;
}

export class Slide implements ISlide {
  constructor(
    public _id?: string,
    public id?: string,
    public index?: number,
    public presentationId?: string,
    public boxIds?: Box[],
    public screenShot?: any
  ) {}
}
