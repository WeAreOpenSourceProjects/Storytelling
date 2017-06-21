import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input,OnChanges } from '@angular/core';
import { SlidesService } from '../../../../services/slides.service';
import { FileUploader} from 'ng2-file-upload';
import {Http } from '@angular/http';
const URL = 'localhost:3000/api/images/';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit,OnChanges {
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('fileDisplayArea') fileDisplayArea: ElementRef;
    @ViewChild('form') form: ElementRef;
    @Output() setImage: EventEmitter<any> = new EventEmitter();
    @Output() uploadImage: EventEmitter<any> = new EventEmitter();

    @Input() label = 'Choose Image';
    @Input() imagePath;
    public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'banner'});

    fileUpload: any;
    image: any = undefined;
    imgPreview  = '';
    id: any;
    constructor(private el: ElementRef, private slidesService: SlidesService) {
    }
    ngOnInit() {
    }
    ngOnChanges(){
      console.log("imagePath",this.imagePath)
      if(this.imagePath){
        this.slidesService.getImage(this.imagePath)
            .subscribe(
            image => {
              this.imgPreview=image;
            },
            error => {
                console.log("fail ");
            });
      }
    }
    onChange () {
      //this.imgPreview = this.imagePath;
      //this.imgPreview = this.imagePath;
        const inputEl = this.el.nativeElement.querySelector('#banner');
      /*  const fileCount: number = inputEl.files.length;
        const formData = new FormData(inputEl);
        if (fileCount > 0) { // a file was selected
            formData.append('banner', inputEl.files[0]);
            this.slidesService.uploadImage(formData).subscribe( image => {
                this.uploadImage.emit(image._id);
                this.imgPreview = image.path;
                console.log("get image");
                this.setImage.emit(image.path);
            });
        }*/
        let file = inputEl.files[0];

        let textType = /image.*/;
        console.log(file.type.match(textType));

        if (file.type.match(textType)) {
            var reader: any = new FileReader();

            reader.onload = (e) => {
                console.log("going to append", e.target);


                //upload image
                let img = {
                    data: file,
                    contentType: 'image/*'
                }
                this.slidesService.uploadImage(file)
                    .subscribe(
                    image => {
                      this.uploadImage.emit(image._id);
                      this.imgPreview = image.path;
                      console.log("get image",image);
                      this.setImage.emit(image._id);
                    },
                    error => {
                        console.log("fail to createSlides");
                    });

            }

            reader.readAsDataURL(file);
        } else {
            console.log("the file format is not correct")
        }
    }
}
