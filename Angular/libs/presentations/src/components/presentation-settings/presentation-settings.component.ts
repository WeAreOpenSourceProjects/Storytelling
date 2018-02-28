import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidService } from '../../services/valid.service';
import { PartialObserver } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { tap } from 'rxjs/operators/tap';

@Component({
  selector: 'app-slides-setting',
  templateUrl: './presentation-settings.component.html',
  styleUrls: ['./presentation-settings.component.scss'],
  providers: []
})
export class PresentationSettingsComponent {
  @ViewChild('tagInput') public tagInput: ElementRef;

  @ViewChild('banner') public banner: ElementRef;

  @Input() public settings: any;

  @Input() public settingsObserver$: PartialObserver<string>;

  public settingsForm: FormGroup;

  private subscriptions: Subscription;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.settingsForm = this.initSettingsForm(this.settings);
    this.subscriptions = this.settingsForm.valueChanges.subscribe(this.settingsObserver$);
  }

  private initSettingsForm(settings) {
    const settingsForm = this.formBuilder.group({
      title: this.formBuilder.control(settings.title),
      description: this.formBuilder.control(settings.description),
      banner: this.formBuilder.control(settings.banner),
      tags: this.formBuilder.array([])
    });
    settings.tags.forEach(tag => settingsForm.get('tags')['controls'].push(this.formBuilder.control(tag)));
    return settingsForm;
  }

  addTag(tag) {
    (this.settingsForm.get('tags') as FormArray).push(this.formBuilder.control(tag));
    this.tagInput.nativeElement.value = '';
  }

  deleteTag(i) {
    (this.settingsForm.get('tags') as FormArray).removeAt(i);
  }

  upload(image) {
    //  this.slidesSetting.banner = image;
    //  this.onSettingChange.emit(this.slidesSetting);
  }

  onChange(event) {
    const file = event.target.files[0];
    const textType = /image.*/;
    if (file.type.match(textType)) {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          this.settingsForm.get('banner').setValue(reader.result);
          this.banner.nativeElement.src = reader.result;
        },
        false
      );
      reader.readAsDataURL(file);
    } else {
      //            this.notifBarService.showNotif("sorry, the image format is not supported")
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
