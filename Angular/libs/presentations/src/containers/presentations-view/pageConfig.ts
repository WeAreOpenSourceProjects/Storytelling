export class PageConfig {
  pageCol: Number = 1;
  hasChart: boolean = false;
  hasText: boolean = false;
  hasImage: boolean = false; //has image in "half text,half graph layout"
  isFullScreen: boolean = true;
  constructor() {}
}
export const HALF_HALF_LAYOUT = {
  pageCol: 2,
  hasImage: false, //will change in cmp
  hasChart: false, //will change in cmp
  hasText: true,
  isFullScreen: false
};

export const FULL_LAYOUT = {
  pageCol: 1,
  hasImage: false, //will change in cmp
  hasChart: false, //will change in cmp
  hasText: false, //will change in cmp
  isFullScreen: true
};
