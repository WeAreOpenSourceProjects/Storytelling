import { NgUploaderModule } from 'ngx-uploader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import {
  MatIconModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    NgUploaderModule,
    MatIconModule
  ],
  declarations: [ ImageUploadComponent ],
  exports: [ ImageUploadComponent ]
})
export class ImageUploadModule { }
