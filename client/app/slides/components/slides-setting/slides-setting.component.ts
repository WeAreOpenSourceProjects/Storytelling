import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { SlidesSetting } from '../../models/slides-setting';
@Component({
    selector: 'app-slides-setting',
    templateUrl: './slides-setting.component.html',
    styleUrls: ['./slides-setting.component.scss']
})
export class SlidesSettingComponent implements OnInit, OnChanges {
    @Input() setting: SlidesSetting;
    @Output() onSettingChange: EventEmitter<SlidesSetting> = new EventEmitter();
    @Output() onValidated = new EventEmitter();
    form: FormGroup;
    slidesSetting: SlidesSetting = new SlidesSetting();
    constructor(private _fb: FormBuilder) {
        this.form = this._buildForm();
    }

    ngOnInit() {
    }
    ngOnChanges() {
        if (this.setting) {
            this.slidesSetting = this.setting;
            this.form = this._buildForm();
        }
        if (this.form.valid) this.onValidated.emit();
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
        if (this.form.valid) this.onValidated.emit();
    }
    descriptionChange(description) {
        this.slidesSetting.description = description;
        this.onSettingChange.emit(this.slidesSetting);
        if (this.form.valid) this.onValidated.emit();
    }
    /* add tages for slides*/
    addTag() {
        this.slidesSetting.tags.push(this.form.value.tag);
        this.onSettingChange.emit(this.slidesSetting);
        this.form.controls.tag.reset();
    }
    /* set banner image*/
    setBanner(path) {
        this.slidesSetting.bannerPath = path;
        this.onSettingChange.emit(this.slidesSetting);
    }
}
