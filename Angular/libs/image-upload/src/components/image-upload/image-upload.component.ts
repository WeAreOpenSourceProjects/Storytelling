import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, ViewContainerRef } from '@angular/core';
import { Http } from '@angular/http';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { DomSanitizer } from '@angular/platform-browser';
//import {NotifBarService} from 'app/core'

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  @Input() editMode : Boolean;
  @Input() image : any;
  @Output() imageId : EventEmitter<String>= new EventEmitter();
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  previewData: any;

  constructor() {
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;

  }
ngOnInit(){
  if(this.image) {
    this.previewData = 'data:'+this.image.contentType+';base64,' + this.arrayBufferToBase64(this.image.data.data);
    this.imageId.emit(this.image._id);
  }
}
  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: 'http://localhost:3000/api/images',
        method: 'POST',
        data: { foo: 'bar' },
        file: this.files[0]
      };
      console.log(this.files[0], event)

      this.uploadInput.emit(event);
      console.log(event);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    } else if (output.type === 'done') {
      this.previewData = 'data:'+output.file.response.contentType+';base64,' + this.arrayBufferToBase64(output.file.response.data.data);
      this.imageId.emit(output.file.response._id);
      console.log(output.file.response._id + ' done');
    }
    this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
    console.log(this.files, this.uploadInput, output);
  }

  startUpload(): void {
    console.log("upload", this.files[0])
    const event: UploadInput = {
      type: 'uploadAll',
        url: 'http://localhost:3000/api/images',
        method: 'POST',
      data: { foo: 'bar' },
      file: this.files[0]
    };

    this.uploadInput.emit(event);
  }
  arrayBufferToBase64(buffer) {
    var binary = '';
    /* eslint no-undef: 0 */
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }



}
