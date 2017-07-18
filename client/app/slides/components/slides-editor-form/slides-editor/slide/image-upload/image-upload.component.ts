import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SlidesService } from '../../../../../services/slides.service';
import { FileUploader} from 'ng2-file-upload';
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
    public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'banner' });

    fileUpload: any;
    image: any = undefined;
    imgPreview = '';
    id: any;
    constructor(private el: ElementRef, private slidesService: SlidesService, private notifBarService: NotifBarService) {
    }
    ngOnInit() {
    }
    ngOnChanges() {
        if (this.imagePath) {
            let path = this.imagePath._id ? this.imagePath._id : this.imagePath;
            this.slidesService.getImage(path)
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
        console.log(file.type.match(textType));

        if (file.type.match(textType)) {
            var reader: any = new FileReader();

            reader.onload = (e) => {
                // upload image
                this.slidesService.uploadImage(file)
                    .subscribe(
                    image => {
                        this.uploadImage.emit(image._id);
                        this.imgPreview = image.path;
                        console.log("get image", image);
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
