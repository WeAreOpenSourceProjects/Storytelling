import {NgGridItemConfig} from 'angular2-grid';

export class Slide {
    boxes: [{
        config: NgGridItemConfig,
        text: any,
        chart: any,
        width: number,
        height: number
    }]= [{config : {},
        text: '',
        chart: '',
        width: 0,
        height: 0}
    ];
    title: string = '';
    index: number = 1;
    isValid: boolean = false;
    constructor(index?: number) {
        if (index) this.index = index;
    }

}
