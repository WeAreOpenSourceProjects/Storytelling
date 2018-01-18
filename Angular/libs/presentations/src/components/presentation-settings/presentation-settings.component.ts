import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidService } from '../../../services/valid.service';
@Component({
  selector: 'app-slides-setting',
  templateUrl: './presention-settings.component.html',
  styleUrls: ['./presention-settings.component.scss'],
  providers: []
})
export class PresentationSettingsComponent implements OnInit, OnChanges {

  @Input()
  public settings: any;

  @Output()
  public onSettingChange: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;

  public slidesSetting: any;

  constructor(private formBuilder: FormBuilder, private validService: ValidService) {
    this.form = this._buildForm();
  }
  
  /*
  ngOnChanges(changes) {
    if (changes.hasOwnProperty('setting') && this.setting) {
      this.slidesSetting = this.setting;
      this.form = this._buildForm();
      this.validService.changeSettingValid(!this.form.controls.title.invalid, 'TITLE');
      this.form.valueChanges.subscribe(data => {
        this.validService.changeSettingValid(!this.form.controls.title.invalid, 'TITLE');
      });
    }
  }
  */
  private ngOnInit() {
    return this.formBuilder.group({
      title: [],
      description: [],
      tag: []
    });
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
