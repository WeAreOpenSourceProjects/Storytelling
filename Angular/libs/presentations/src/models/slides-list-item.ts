export class SlidesListItem {
  id: string = '';
  title: string = '';
  description: string = '';
  tags: Array<string> = [];
  bannerPath: String = '';
  public: boolean = false;
  favorite: boolean = false;
  author: String = '';
  constructor(slides?) {
    this.id = (slides && slides._id) || '';
    this.title = (slides && slides.title) || '';
    this.description = (slides && slides.description) || '';
    this.tags = (slides && slides.tags) || [];
    this.public = slides && slides.public;
    this.bannerPath = (slides && slides.bannerPath) || '';
    this.author = (slides && slides.author) || '';
  }
}
