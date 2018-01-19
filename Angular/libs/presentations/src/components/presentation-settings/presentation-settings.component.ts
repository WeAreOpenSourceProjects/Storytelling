import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidService } from '../../services/valid.service';

@Component({
  selector: 'app-slides-setting',
  templateUrl: './presentation-settings.component.html',
  styleUrls: ['./presentation-settings.component.scss'],
  providers: []
})
export class PresentationSettingsComponent {

  @ViewChild('tagInput')
  public tagInput: ElementRef

  public settingsForm = this.formBuilder.group({
    title: '',
    description: '',
    tags: this.formBuilder.array([])
  });

  constructor(private formBuilder: FormBuilder) { }

  addTag(tag) {
    const control = <FormArray>this.settingsForm.controls['tags'];
    control.push(this.formBuilder.group({ tag }));
    this.tagInput.nativeElement.value = '';
  }

  deleteTag(i) {
    const control = <FormArray>this.settingsForm.controls['tags'];
    control.removeAt(i);
  }
  setBanner(path) {
  //  this.onSettingChange.emit(this.slidesSetting);
  }

  upload(image) {
  //  this.slidesSetting.banner = image;
  //  this.onSettingChange.emit(this.slidesSetting);
  }
}
