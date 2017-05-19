import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { SlidesService } from '../../../../services/slides.service';

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
    image: any = undefined;
    constructor(private el: ElementRef, private slidesService: SlidesService) {
    }
    ngOnInit() {}
    onChange () {
        const inputEl = this.el.nativeElement.querySelector('#banner');
        const fileCount: number = inputEl.files.length;
        const formData = new FormData(inputEl);
        if (fileCount > 0) { // a file was selected
            formData.append('banner', inputEl.files[0]);
            this.slidesService.uploadImage(formData).subscribe( id => {
                this.uploadImage.emit(id);
            });
        }
    }
}
