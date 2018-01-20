import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidService } from '../../services/valid.service';
import { PartialObserver } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-slides-setting',
  templateUrl: './presentation-settings.component.html',
  styleUrls: ['./presentation-settings.component.scss'],
  providers: []
})
export class PresentationSettingsComponent {

  @ViewChild('tagInput')
  public tagInput: ElementRef

  @Input()
  public settings: any;

  @Input()
  public settingsObserver$: PartialObserver<string>;

  public settingsForm: FormGroup;

  private subscriptions: Subscription;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.settingsForm = this.initSettingsForm(this.settings);
    this.subscriptions = this.settingsForm
    .valueChanges
    .subscribe(this.settingsObserver$);
  }

  private initSettingsForm(settings) {
    console.log('J??')
    const settingsForm = this.formBuilder.group({
      title: this.formBuilder.control(settings.title),
      description: this.formBuilder.control(settings.description),
    });
    settingsForm.addControl('tags', this.formBuilder.array([]))
    settings.tags.forEach(tag => (settingsForm.get('tags') as FormArray).push(this.formBuilder.control(tag)));
    return settingsForm;
  }

  addTag(tag) {
    (this.settingsForm.get('tags') as FormArray).push(this.formBuilder.control(tag));
    this.tagInput.nativeElement.value = '';
  }

  deleteTag(i) {
    (this.settingsForm.get('tags') as FormArray).removeAt(i);
  }

  setBanner(path) {
  //  this.onSettingChange.emit(this.slidesSetting);
  }

  upload(image) {
  //  this.slidesSetting.banner = image;
  //  this.onSettingChange.emit(this.slidesSetting);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
