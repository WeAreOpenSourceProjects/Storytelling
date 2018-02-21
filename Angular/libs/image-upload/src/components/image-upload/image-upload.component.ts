import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, HostListener, OnChanges, ViewContainerRef } from '@angular/core';
import { Http } from '@angular/http';
import { UploadOutput, UploadInput, UploadFile, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../apps/default/src/environments/environment'

//import {NotifBarService} from 'app/core'

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  @Input() image : any;
  @Output() getImageId : EventEmitter<String>= new EventEmitter();
  @Input() presentationMode : Boolean = false;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  dragOver: boolean;
  options: UploaderOptions;
  previewData: any;
  endpoints : any;
  baseUrl : string;
  backendURL: string;
  editMode : Boolean = true;
  idImage : string;
  constructor() {
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    const { protocol, host, port, endpoints } = environment.backend;
    this.endpoints = endpoints;
    this.baseUrl = `${protocol}://${host}:${port}/${endpoints.basePath}`;
    this.backendURL = `${this.baseUrl}/${this.endpoints.images}`;
  }
ngOnInit(){
  if(this.image) {
    console.log(this.image);
    this.previewData = 'data:'+this.image.contentType+';base64,' + this.arrayBufferToBase64(this.image.data.data);
    this.idImage = this.image._id;
    this.getImageId.emit(this.image._id);
  }

}
  onUploadOutput(output: UploadOutput): void {
    let event: UploadInput;
    if(!this.idImage){
      event = {
        type: 'uploadAll',
        url: this.backendURL,
        method: 'POST',
        file: this.files[0]
      };
      console.log(this.files[0], event)
    } else {
      event = {
        type: 'uploadAll',
        url: `${this.backendURL}/${this.idImage}`,
        method: 'PUT',
        file: this.files[0]
      };
    }

    if (output.type === 'allAddedToQueue') {
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
      this.getImageId.emit(output.file.response._id);
      this.idImage = output.file.response._id;
      this.editMode = false;
    }
    this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  }

  startUpload(): void {
    console.log("upload", this.files[0])
    const event: UploadInput = {
      type: 'uploadAll',
        url: this.backendURL,
        method: 'POST',
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

  public setEditMode(value){
    this.editMode = value;
  }

}
