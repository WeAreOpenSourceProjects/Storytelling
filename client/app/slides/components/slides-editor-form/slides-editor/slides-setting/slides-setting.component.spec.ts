import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesSettingComponent } from './slides-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadComponent } from '../slide/image-upload/image-upload.component';
import { MaterialModule } from '@angular/material';
import {ValidService} from '../../../../services/valid.service';
import { SlidesService } from '../../../../services/slides.service';
import {HttpModule} from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NotifBarService} from 'app/core';


describe('SlidesSettingComponent', () => {
  let component: SlidesSettingComponent;
  let fixture: ComponentFixture<SlidesSettingComponent>;
  let slidesServiceStub = {};
  let slidesService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesSettingComponent, ImageUploadComponent ],
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule, HttpModule,  MaterialModule ],
      providers: [ValidService, {provide: SlidesService, useValue:slidesServiceStub }, NotifBarService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
      slidesService = TestBed.get(SlidesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
