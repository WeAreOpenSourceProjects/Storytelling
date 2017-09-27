import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SlidesService, ImagesService } from '../../../../../../services';
import {Http } from '@angular/http';
import {NotifBarService} from 'app/core'
const URL = 'localhost:3000/api/images/';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnChanges {
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('fileDisplayArea') fileDisplayArea: ElementRef;
    @ViewChild('form') form: ElementRef;
    @Output() setImage: EventEmitter<any> = new EventEmitter();
    @Output() uploadImage: EventEmitter<any> = new EventEmitter();

    @Input() label = 'Choose Image';
    @Input() imagePath;

    fileUpload: any;
    image: any = undefined;
    imgPreview = '';
    id: any;
    constructor(
      private el: ElementRef,
      private slidesService: SlidesService,
      private imagesService:ImagesService,
      private notifBarService: NotifBarService) {
    }
    ngOnInit() {
    }
    ngOnChanges() {
        if (this.imagePath) {
            let path = this.imagePath._id ? this.imagePath._id : this.imagePath;
            this.imagesService.getImage(path)
                .subscribe(
                image => {
                    this.imgPreview = image;
                },
                error => {
                    this.notifBarService.showNotif("fail to get image, the error is : " + error);
                });
        }
    }
    onChange() {
        const inputEl = this.el.nativeElement.querySelector('#banner');
        let file = inputEl.files[0];

        let textType = /image.*/;

        if (file.type.match(textType)) {
            var reader: any = new FileReader();

            reader.onload = (e) => {
                // upload image
                this.imagesService.uploadImage(file)
                    .subscribe(
                    image => {
                        this.uploadImage.emit(image._id);
                        this.imgPreview = image.path;
                        this.setImage.emit(image._id);
                        this.notifBarService.showNotif("upload image successfully")
                    },
                    error => {
                        this.notifBarService.showNotif("opps! fail to upload image: " + error);
                    });

            };
            reader.readAsDataURL(file);
        } else {
            this.notifBarService.showNotif("sorry, the image format is not supported")
        }
    }
}
