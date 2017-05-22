import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { SlidesService } from '../../../../services/slides.service';
import { FileUploader} from 'ng2-file-upload';
import {Http } from '@angular/http';
const URL = 'localhost:3000/api/images/';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('fileDisplayArea') fileDisplayArea: ElementRef;
    @ViewChild('form') form: ElementRef;
    @Output() setImage: EventEmitter<any> = new EventEmitter();
    @Output() uploadImage: EventEmitter<any> = new EventEmitter();

    @Input() label = 'Choose Image';
    public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'banner'});

    image: any = undefined;
    imgPreview  = '';
    id: any;
    constructor(private el: ElementRef, private slidesService: SlidesService) {
    }
    ngOnInit() {}
    onChange () {
        const inputEl = this.el.nativeElement.querySelector('#banner');
        const fileCount: number = inputEl.files.length;
        const formData = new FormData(inputEl);
        if (fileCount > 0) { // a file was selected
            formData.append('banner', inputEl.files[0]);
            this.slidesService.uploadImage(formData).subscribe( image => {
                this.uploadImage.emit(image._id);
                this.imgPreview = image.path;
            });
        }
    }
}
