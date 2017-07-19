import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SlidesService } from '../../../../../services/slides.service';
import { ImageUploadComponent } from './image-upload.component';
import { NotifBarService } from 'app/core';
import { MaterialModule } from '@angular/material';
describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUploadComponent ],
      imports: [FormsModule, HttpModule, MaterialModule],
      providers: [SlidesService, NotifBarService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
