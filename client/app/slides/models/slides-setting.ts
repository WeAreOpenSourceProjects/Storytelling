export class SlidesSetting {
    title: String = '';
    description: String = '';
    tags: Array<string> = [];
    public: Boolean = false;
    favorite: Boolean = false;
    author: String = '';
    banner: any;
    constructor(setting?: SlidesSetting) {
        if (setting) {
            if (setting.title) this.title = setting.title;
            if (setting.description) this.description = setting.description;
            if (setting.tags) this.tags = setting.tags;
            if (setting.public) this.public = setting.public;
            if (setting.favorite) this.favorite = setting.favorite;
            if (setting.author) this.author = setting.author;
            if (setting.banner || setting.banner._id) this.banner = setting.banner._id;
        }
    }
}
