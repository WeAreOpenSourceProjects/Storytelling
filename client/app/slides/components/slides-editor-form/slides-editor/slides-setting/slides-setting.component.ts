import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { SlidesSetting } from '../../../../models/slides-setting';
import {ValidService} from '../../../../services/valid.service';
@Component({
    selector: 'app-slides-setting',
    templateUrl: './slides-setting.component.html',
    styleUrls: ['./slides-setting.component.scss'],
    providers: []
})
export class SlidesSettingComponent implements OnInit, OnChanges {
    @Input() setting: SlidesSetting;
    @Output() onSettingChange: EventEmitter<SlidesSetting> = new EventEmitter();

    form: FormGroup;
    slidesSetting: SlidesSetting;

    constructor(private _fb: FormBuilder, private validService: ValidService) {
        this.slidesSetting = new SlidesSetting();
        this.form = this._buildForm();
    }

    ngOnInit() {
        this.validService.changeSettingValid(false);
        this.form.valueChanges.subscribe(data => {
            this.validService.changeSettingValid(!this.form.controls.title.invalid,"TITLE");
        });

    }
    ngOnChanges(changes) {
        if (changes.hasOwnProperty('setting') && this.setting) {
            this.slidesSetting = this.setting;
            this.form = this._buildForm(); this.validService.changeSettingValid(!this.form.controls.title.invalid,"TITLE");
            this.form.valueChanges.subscribe(data => {
                this.validService.changeSettingValid(!this.form.controls.title.invalid,"TITLE");
            });
        }
    }
    private _buildForm() {
        return this._fb.group({
            title: new FormControl(this.slidesSetting.title, Validators.required),
            description: new FormControl(this.slidesSetting.description, Validators.nullValidator),
            tag: new FormControl('', Validators.nullValidator)
        });
    }
    titleChange(title) {
        this.slidesSetting.title = title;
        this.onSettingChange.emit(this.slidesSetting);

    }
    descriptionChange(description) {
        this.slidesSetting.description = description;
        this.onSettingChange.emit(this.slidesSetting);
    }
    publicStatusChange(publicStatus) {
        this.slidesSetting.public = !this.slidesSetting.public;
        this.onSettingChange.emit(this.slidesSetting);
    }
    /* tag operation*/
    addTag() {
        this.slidesSetting.tags.push(this.form.value.tag);
        this.onSettingChange.emit(this.slidesSetting);
        this.form.controls.tag.reset();
    }
    deleteTag(index) {
        this.slidesSetting.tags.splice(index, 1);
    }
    /* set banner image*/
    setBanner(path) {
        this.onSettingChange.emit(this.slidesSetting);
    }
    upload(image) {
        this.slidesSetting.banner = image;
        this.onSettingChange.emit(this.slidesSetting);
    }
}
