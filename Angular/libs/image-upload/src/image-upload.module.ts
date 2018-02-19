import { NgUploaderModule } from 'ngx-uploader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';

@NgModule({
  imports: [
    CommonModule,
    NgUploaderModule
  ],
  declarations: [ ImageUploadComponent ],
  exports: [ ImageUploadComponent ]
})
export class ImageUploadModule { }
